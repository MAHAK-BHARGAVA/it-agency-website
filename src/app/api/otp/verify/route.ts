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
      emailOtp,
      phoneOtp,
    } = body;

    if (!verificationId || !email || !phone || !emailOtp || !phoneOtp) {
      return NextResponse.json(
        {
          success: false,
          message: "Verification ID, email, phone and both OTPs are required.",
        },
        { status: 400 }
      );
    }

    const normalizedEmail = normalizeEmail(email);
    const normalizedPhone = normalizePhone(phone);

    const verification = await prisma.leadVerification.findUnique({
      where: {
        id: verificationId,
      },
    });

    if (!verification) {
      return NextResponse.json(
        {
          success: false,
          message: "Verification session not found or expired.",
        },
        { status: 404 }
      );
    }

    // Make sure the OTP session belongs to this email/phone
    if (
      verification.email !== normalizedEmail ||
      verification.phone !== normalizedPhone
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Verification details do not match.",
        },
        { status: 400 }
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
          message: "OTP has expired. Please request a new OTP.",
        },
        { status: 400 }
      );
    }

    // Check attempts
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

    const isEmailOtpValid = verifyOtp(
      String(emailOtp).trim(),
      verification.emailOtpHash
    );

    const isPhoneOtpValid = verifyOtp(
      String(phoneOtp).trim(),
      verification.phoneOtpHash
    );

    // Wrong OTP
    if (!isEmailOtpValid || !isPhoneOtpValid) {
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
          message: "Invalid OTP. Please check both OTPs and try again.",
        },
        { status: 400 }
      );
    }

    // Both OTPs are valid
    const updatedVerification =
      await prisma.leadVerification.update({
        where: {
          id: verification.id,
        },
        data: {
          emailVerified: true,
          phoneVerified: true,
        },
      });

    return NextResponse.json({
      success: true,
      message: "Email and phone verified successfully.",
      verificationId: updatedVerification.id,
    });
  } catch (error) {
    console.error("OTP verification error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while verifying the OTP.",
      },
      { status: 500 }
    );
  }
}