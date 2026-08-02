import { NextResponse } from "next/server";
import { Resend } from "resend";

import NewLeadEmail from "@/emails/NewLeadEmail";
import { prisma } from "@/lib/prisma";
import { leadRateLimit } from "@/lib/ratelimit";

const resend = new Resend(process.env.RESEND_API_KEY);

const allowedStartTimes = [
  "Immediately",
  "Within 1 Month",
  "Within 3 Months",
  "Just Exploring",
];

export async function POST(request: Request) {
  try {
    /*
     * 1. Identify the requester for rate limiting.
     */
    const forwardedFor = request.headers.get("x-forwarded-for");

    const ip =
      forwardedFor?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    /*
     * 2. Apply rate limiting before doing database work.
     */
    const rateLimitResult = await leadRateLimit.limit(ip);

    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Too many enquiries. Please wait a few minutes before trying again.",
        },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": String(rateLimitResult.limit),
            "X-RateLimit-Remaining": String(
              rateLimitResult.remaining,
            ),
            "X-RateLimit-Reset": String(rateLimitResult.reset),
          },
        },
      );
    }

    /*
     * 3. Read and normalize submitted values.
     */
    const body = await request.json();

    const name = String(body.name ?? "").trim();
    const phone = String(body.phone ?? "").trim();
    const serviceId = Number(body.serviceId);

    const preferredStartTime = String(
      body.preferredStartTime ?? "",
    ).trim();

    const website = String(body.website ?? "").trim();

    /*
     * 4. Honeypot protection.
     *
     * Real users cannot see this field. Bots often fill it.
     * We silently return success without saving anything.
     */
    if (website) {
      return NextResponse.json(
        {
          success: true,
          message: "Enquiry submitted successfully.",
        },
        { status: 201 },
      );
    }

    /*
     * 5. Server-side validation.
     */
    if (name.length < 2 || name.length > 100) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter a valid full name.",
        },
        { status: 400 },
      );
    }

    const cleanedPhone = phone.replace(/\D/g, "");

    if (cleanedPhone.length < 10 || cleanedPhone.length > 15) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter a valid contact number.",
        },
        { status: 400 },
      );
    }

    if (!Number.isInteger(serviceId) || serviceId <= 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Please select a valid service.",
        },
        { status: 400 },
      );
    }

    if (!allowedStartTimes.includes(preferredStartTime)) {
      return NextResponse.json(
        {
          success: false,
          message: "Please select a valid preferred start time.",
        },
        { status: 400 },
      );
    }

    /*
     * 6. Confirm that the selected service exists.
     */
    const service = await prisma.service.findUnique({
      where: {
        id: serviceId,
      },
      select: {
        id: true,
        name: true,
      },
    });

    if (!service) {
      return NextResponse.json(
        {
          success: false,
          message: "The selected service does not exist.",
        },
        { status: 404 },
      );
    }

    /*
     * 7. Save the lead before attempting email delivery.
     *
     * This ensures the lead is not lost if Resend fails.
     */
    const lead = await prisma.lead.create({
      data: {
        name,
        phone,
        serviceId,
        preferredStartTime,
        source: "website",
      },
    });

    let emailSent = false;

    /*
     * 8. Load email routing settings and send notification.
     */
    try {
      const settings = await prisma.siteSetting.findUnique({
        where: {
          id: 1,
        },
        select: {
          companyName: true,
          email: true,
          salesEmail: true,
          seoEmail: true,
          aiEmail: true,
          supportEmail: true,
          mediaEmail: true,
        },
      });

      if (!settings) {
        throw new Error("Site settings were not found.");
      }

      const emailFrom = process.env.EMAIL_FROM;

      if (!process.env.RESEND_API_KEY) {
        throw new Error("RESEND_API_KEY is missing.");
      }

      if (!emailFrom) {
        throw new Error("EMAIL_FROM is missing.");
      }

      const recipientEmail = getRecipientEmail(
        service.name,
        settings,
      );

      const { error } = await resend.emails.send({
        from: emailFrom,
        to: [recipientEmail],
        subject: `New Website Enquiry — ${service.name}`,

        react: NewLeadEmail({
          companyName: settings.companyName,
          clientName: name,
          phone,
          serviceName: service.name,
          preferredStartTime,
          leadId: lead.id,
        }),
      });

      if (error) {
        console.error("Resend email error:", error);
      } else {
        emailSent = true;
      }
    } catch (emailError) {
      /*
       * Do not fail the complete enquiry request here.
       * The lead has already been saved successfully.
       */
      console.error("Lead saved, but email failed:", emailError);
    }

    /*
     * 9. Return success even if the email failed,
     * because the lead was saved successfully.
     */
    return NextResponse.json(
      {
        success: true,
        message: "Enquiry submitted successfully.",
        leadId: lead.id,
        emailSent,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Lead submission error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong. Please try again.",
      },
      { status: 500 },
    );
  }
}

type EmailSettings = {
  companyName: string;
  email: string;
  salesEmail: string | null;
  seoEmail: string | null;
  aiEmail: string | null;
  supportEmail: string | null;
  mediaEmail: string | null;
};

function getRecipientEmail(
  serviceName: string,
  settings: EmailSettings,
): string {
  const normalizedService = serviceName.toLowerCase();

  /*
   * SEO and content-marketing enquiries.
   */
  if (
    normalizedService.includes("seo") ||
    normalizedService.includes("content marketing")
  ) {
    return settings.seoEmail || settings.email;
  }

  /*
   * AI and business-automation enquiries.
   */
  if (
    normalizedService.includes("ai") ||
    normalizedService.includes("business automation")
  ) {
    return settings.aiEmail || settings.email;
  }

  /*
   * IT-support and cloud enquiries.
   */
  if (
    normalizedService.includes("it support") ||
    normalizedService.includes("cloud")
  ) {
    return settings.supportEmail || settings.email;
  }

  /*
   * Photography, video, influencer and creator enquiries.
   */
  if (
    normalizedService.includes("photography") ||
    normalizedService.includes("video") ||
    normalizedService.includes("influencer") ||
    normalizedService.includes("creator")
  ) {
    return settings.mediaEmail || settings.email;
  }

  /*
   * Website, app, e-commerce, branding, social media,
   * marketing automation and other sales enquiries.
   */
  return settings.salesEmail || settings.email;
}