import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  generateOtp,
  hashOtp,
  getOtpExpiry,
  normalizeEmail,
  normalizePhone,
} from "@/lib/otp";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      verificationId,
      email,
      phone,
    } = body;

    if (!verificationId || !email || !phone) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Verification ID, email and phone are required.",
        },
        { status: 400 }
      );
    }

    const normalizedEmail = normalizeEmail(email);
    const normalizedPhone = normalizePhone(phone);

    // Find verification session
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
          message:
            "Verification session not found or expired.",
        },
        { status: 404 }
      );
    }

    // Make sure email and phone match
    if (
      verification.email !== normalizedEmail ||
      verification.phone !== normalizedPhone
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Verification details do not match.",
        },
        { status: 400 }
      );
    }

    // Email MUST be verified first
    if (!verification.emailVerified) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please verify your email before verifying your phone.",
        },
        { status: 403 }
      );
    }

    // Check expiry
    if (verification.expiresAt < new Date()) {
      await prisma.leadVerification.delete({
        where: {
          id: verification.id,
        },
      });

      return NextResponse.json(
        {
          success: false,
          message:
            "Verification session has expired. Please start again.",
        },
        { status: 400 }
      );
    }

    // 60 second resend cooldown
if (
  verification.phoneOtpHash &&
  verification.lastSentAt &&
  Date.now() -
    verification.lastSentAt.getTime() <
    60 * 1000
) {
  return NextResponse.json(
    {
      success: false,
      message:
        "Please wait before requesting another OTP.",
    },
    { status: 429 }
  );
}

    // Generate phone OTP
    const phoneOtp = generateOtp();
    const phoneOtpHash = hashOtp(phoneOtp);

    const updatedVerification =
      await prisma.leadVerification.update({
        where: {
          id: verification.id,
        },
        data: {
          phoneOtpHash,
          phoneVerified: false,
          attempts: 0,
          lastSentAt: new Date(),
          expiresAt: getOtpExpiry(),
        },
      });

    // LOCAL DEVELOPMENT ONLY
    console.log(
      `[DEV ONLY] Phone OTP for ${normalizedPhone}: ${phoneOtp}`
    );

    return NextResponse.json({
      success: true,
      verificationId: updatedVerification.id,
      message: "Phone OTP generated successfully.",
    });
  } catch (error) {
    console.error(
      "Phone OTP generation error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to generate phone OTP.",
      },
      { status: 500 }
    );
  }
}