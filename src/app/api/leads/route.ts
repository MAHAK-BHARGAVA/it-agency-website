import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

import NewLeadEmail from "@/emails/NewLeadEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const verificationId = String(
      body.verificationId ?? ""
    ).trim();

    /* -----------------------------------------
       1. VERIFICATION ID
    ----------------------------------------- */

    if (!verificationId) {
      return NextResponse.json(
        {
          success: false,
          error: "Email verification is required.",
        },
        { status: 403 }
      );
    }

    /* -----------------------------------------
       2. GET VERIFIED SESSION
    ----------------------------------------- */

    const verification =
      await prisma.leadVerification.findUnique({
        where: {
          id: verificationId,
        },
      });

    if (!verification) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Verification session not found or already used.",
        },
        { status: 403 }
      );
    }

    /* -----------------------------------------
       3. EMAIL OTP VERIFICATION
    ----------------------------------------- */

    if (!verification.emailVerified) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Please verify your email before submitting.",
        },
        { status: 403 }
      );
    }

    /* -----------------------------------------
       4. CHECK EXPIRY
    ----------------------------------------- */

    if (verification.expiresAt < new Date()) {
      await prisma.leadVerification.delete({
        where: {
          id: verificationId,
        },
      });

      return NextResponse.json(
        {
          success: false,
          error:
            "Verification session has expired. Please request a new OTP.",
        },
        { status: 403 }
      );
    }

    /* -----------------------------------------
       5. GET SERVICE
    ----------------------------------------- */

    let serviceName = "General Enquiry";

    if (verification.serviceId) {
      const service =
        await prisma.service.findUnique({
          where: {
            id: verification.serviceId,
          },
          select: {
            name: true,
          },
        });

      if (!service) {
        return NextResponse.json(
          {
            success: false,
            error: "Selected service was not found.",
          },
          { status: 400 }
        );
      }

      serviceName = service.name;
    }

    /* -----------------------------------------
       6. CREATE LEAD + CONSUME VERIFICATION
    ----------------------------------------- */

    const lead = await prisma.$transaction(
      async (tx) => {
        // Re-check inside transaction
        const currentVerification =
          await tx.leadVerification.findUnique({
            where: {
              id: verificationId,
            },
          });

        if (
          !currentVerification ||
          !currentVerification.emailVerified
        ) {
          throw new Error(
            "VERIFICATION_ALREADY_USED"
          );
        }

        const createdLead =
          await tx.lead.create({
            data: {
              name: currentVerification.name,

              email: currentVerification.email,

              phone: currentVerification.phone,

              message:
                currentVerification.message,

              city:
                currentVerification.city,

              serviceId:
                currentVerification.serviceId,

              preferredStartTime:
                currentVerification.preferredStartTime,

              source: "website",
            },
          });

        // OTP session is now consumed
        await tx.leadVerification.delete({
          where: {
            id: verificationId,
          },
        });

        return createdLead;
      }
    );

    /* -----------------------------------------
       7. SEND EMAIL TO SOCLTHRY
    ----------------------------------------- */

    const companyName =
      process.env.COMPANY_NAME ||
      "Soclthry";

    const companyEmail =
      process.env.COMPANY_EMAIL;

    const resendFrom =
      process.env.RESEND_FROM_EMAIL;

    if (!process.env.RESEND_API_KEY) {
      console.error(
        "RESEND_API_KEY is missing."
      );
    } else if (!companyEmail) {
      console.error(
        "COMPANY_EMAIL is missing."
      );
    } else if (!resendFrom) {
      console.error(
        "RESEND_FROM_EMAIL is missing."
      );
    } else {
      try {
        const result =
          await resend.emails.send({
            from: resendFrom,

            to: [companyEmail],

            replyTo:
              lead.email ?? undefined,

            subject:
              `New Website Enquiry — ${serviceName}`,

            react: NewLeadEmail({
              companyName,

              clientName:
                lead.name,

              clientEmail:
                lead.email ?? undefined,

              phone:
                lead.phone,

              serviceName:
                serviceName,

              preferredStartTime:
                lead.preferredStartTime ??
                "Not specified",

              leadId:
                lead.id,
            }),
          });

        if (result.error) {
          console.error(
            "RESEND ERROR:",
            result.error
          );
        }
      } catch (emailError) {
        console.error(
          "Notification email failed:",
          emailError
        );
      }
    }

    /* -----------------------------------------
       8. SUCCESS
    ----------------------------------------- */

    return NextResponse.json(
      {
        success: true,

        message:
          "Enquiry submitted successfully.",

        leadId:
          lead.id,
      },
      { status: 201 }
    );
  } catch (error) {
    if (
      error instanceof Error &&
      error.message ===
        "VERIFICATION_ALREADY_USED"
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "This verification has already been used. Please submit a new enquiry.",
        },
        { status: 403 }
      );
    }

    console.error(
      "LEADS API ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to submit your enquiry. Please try again.",
      },
      { status: 500 }
    );
  }
}