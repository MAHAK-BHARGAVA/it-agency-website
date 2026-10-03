import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  normalizeEmail,
  normalizePhone,
  verifyOtp,
} from "@/lib/otp";

const MAX_ATTEMPTS = 5;

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      verificationId,
      email,
      phone,
      phoneOtp,
    } = body;

    // 1. Validate request
    if (!verificationId || !email || !phone || !phoneOtp) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Verification ID, email, phone and phone OTP are required.",
        },
        { status: 400 }
      );
    }

    const normalizedEmail = normalizeEmail(email);
    const normalizedPhone = normalizePhone(phone);

    // 2. Find verification session
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

    // 3. Make sure email and phone match the session
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

    // 4. Email must already be verified
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

    // 5. Check expiry
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
            "OTP has expired. Please request a new OTP.",
        },
        { status: 400 }
      );
    }

    // 6. Check attempts
    if (verification.attempts >= MAX_ATTEMPTS) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Maximum verification attempts exceeded. Please request a new OTP.",
        },
        { status: 429 }
      );
    }

    // 7. Make sure phone OTP exists
    if (!verification.phoneOtpHash) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Phone OTP not found. Please request a new OTP.",
        },
        { status: 400 }
      );
    }

    // 8. Verify OTP
    const isValid = verifyOtp(
      String(phoneOtp).trim(),
      verification.phoneOtpHash
    );

    // 9. Invalid OTP
    if (!isValid) {
      await prisma.leadVerification.update({
        where: {
          id: verification.id,
        },
        data: {
          attempts: {
            increment: 1,
          },
        },
      });

      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid phone OTP. Please check the code and try again.",
        },
        { status: 400 }
      );
    }

    // 10. Phone verified successfully
    const updatedVerification =
      await prisma.leadVerification.update({
        where: {
          id: verification.id,
        },
        data: {
          phoneVerified: true,
          attempts: 0,
        },
      });

    return NextResponse.json({
      success: true,
      message: "Phone verified successfully.",
      verificationId: updatedVerification.id,
    });
  } catch (error) {
    console.error(
      "Phone OTP verification error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Something went wrong while verifying your phone.",
      },
      { status: 500 }
    );
  }
}