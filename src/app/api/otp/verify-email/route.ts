import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  normalizeEmail,
  verifyOtp,
} from "@/lib/otp";

const MAX_ATTEMPTS = 5;

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      verificationId,
      email,
      emailOtp,
    } = body;

    if (!verificationId || !email || !emailOtp) {
      return NextResponse.json(
        {
          success: false,
          message: "Verification ID, email and email OTP are required.",
        },
        { status: 400 }
      );
    }

    const normalizedEmail = normalizeEmail(email);

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
          message: "Verification session not found or expired.",
        },
        { status: 404 }
      );
    }

    // Make sure email matches
    if (verification.email !== normalizedEmail) {
      return NextResponse.json(
        {
          success: false,
          message: "Verification email does not match.",
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

    // Check maximum attempts
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

    // Verify email OTP
    const isValid = verifyOtp(
      String(emailOtp).trim(),
      verification.emailOtpHash
    );

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
          message: "Invalid email OTP. Please check the code and try again.",
        },
        { status: 400 }
      );
    }

    // Email successfully verified
    const updatedVerification =
      await prisma.leadVerification.update({
        where: {
          id: verification.id,
        },
        data: {
          emailVerified: true,
          attempts: 0,
        },
      });

    return NextResponse.json({
      success: true,
      message: "Email verified successfully.",
      verificationId: updatedVerification.id,
    });
  } catch (error) {
    console.error("Email OTP verification error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while verifying your email.",
      },
      { status: 500 }
    );
  }
}