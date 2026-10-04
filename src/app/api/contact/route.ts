import { prisma } from "@/lib/prisma";
import {
  NextRequest,
  NextResponse,
} from "next/server";
import { Resend } from "resend";

import NewLeadEmail from "@/emails/NewLeadEmail";
import ThankYouEmail from "@/emails/ThankYouEmail";

const resend = new Resend(
  process.env.RESEND_API_KEY
);

export async function POST(
  request: NextRequest
) {
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
          error:
            "Email and phone verification is required.",
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
       3. OTP VERIFICATION
    ----------------------------------------- */

    if (
      !verification.emailVerified ||
      !verification.phoneVerified
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Please verify both email and phone before submitting.",
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
            error:
              "Selected service was not found.",
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
        // Re-check verification inside transaction
        const currentVerification =
          await tx.leadVerification.findUnique({
            where: {
              id: verificationId,
            },
          });

        if (
          !currentVerification ||
          !currentVerification.emailVerified ||
          !currentVerification.phoneVerified
        ) {
          throw new Error(
            "VERIFICATION_ALREADY_USED"
          );
        }

        const createdLead =
          await tx.lead.create({
            data: {
              name:
                currentVerification.name,

              email:
                currentVerification.email,

              phone:
                currentVerification.phone,

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

        // Verification session is now consumed
        await tx.leadVerification.delete({
          where: {
            id: verificationId,
          },
        });

        return createdLead;
      }
    );

    /* -----------------------------------------
       7. EMAIL CONFIG
    ----------------------------------------- */

    const companyName =
      process.env.COMPANY_NAME ||
      "Soclthry";

    const companyEmail =
      process.env.COMPANY_EMAIL;

    const resendFrom =
      process.env.RESEND_FROM_EMAIL;

    /* -----------------------------------------
       8. SEND COMPANY NOTIFICATION
    ----------------------------------------- */

    if (
      process.env.RESEND_API_KEY &&
      companyEmail &&
      resendFrom
    ) {
      try {
        const result =
          await resend.emails.send({
            from: resendFrom,

            to: [companyEmail],

            replyTo:
              lead.email ?? undefined,

            subject:
              `New Website Enquiry — ${lead.name}`,

            react: NewLeadEmail({
              companyName,

              clientName:
                lead.name,

              clientEmail:
                lead.email ?? undefined,

              phone:
                lead.phone,

              city:
                lead.city ?? undefined,

              serviceName,

              preferredStartTime:
                lead.preferredStartTime ??
                "Not specified",

              message:
                lead.message ?? undefined,

              leadId:
                lead.id,
            }),
          });

        if (result.error) {
          console.error(
            "Company notification email failed:",
            result.error
          );
        }
      } catch (emailError) {
        console.error(
          "Company notification email failed:",
          emailError
        );
      }
    } else {
      console.error(
        "Missing Resend configuration for company notification."
      );
    }

    /* -----------------------------------------
       9. SEND THANK-YOU EMAIL TO CUSTOMER
    ----------------------------------------- */

    if (
      process.env.RESEND_API_KEY &&
      lead.email &&
      resendFrom
    ) {
      try {
        const result =
          await resend.emails.send({
            from: resendFrom,

            to: [lead.email],

            subject:
              "We received your enquiry — Soclthry",

            react: ThankYouEmail({
              clientName:
                lead.name,

              serviceName,
            }),
          });

        if (result.error) {
          console.error(
            "Thank-you email failed:",
            result.error
          );
        }
      } catch (emailError) {
        console.error(
          "Thank-you email failed:",
          emailError
        );
      }
    } else {
      console.error(
        "Missing Resend configuration for customer thank-you email."
      );
    }

    /* -----------------------------------------
       10. SUCCESS
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
    /* -----------------------------------------
       VERIFICATION ALREADY USED
    ----------------------------------------- */

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

    /* -----------------------------------------
       GENERAL ERROR
    ----------------------------------------- */

    console.error(
      "CONTACT API ERROR:",
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