import { NextResponse } from "next/server";
import { Resend } from "resend";
import OTPEmail from "@/emails/OTPEmail";
import { prisma } from "@/lib/prisma";
import {
  generateOtp,
  hashOtp,
  getOtpExpiry,
  normalizeEmail,
  normalizePhone,
} from "@/lib/otp";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { name, email, phone, serviceId, city, message, preferredStartTime } =
      body;

    if (!name || !email || !phone) {
      return NextResponse.json(
        {
          success: false,
          message: "Name, email and phone are required.",
        },
        { status: 400 },
      );
    }

    const normalizedEmail = normalizeEmail(email);
    const normalizedPhone = normalizePhone(phone);

    // Find latest verification for this email + phone
    const existing = await prisma.leadVerification.findFirst({
      where: {
        email: normalizedEmail,
        phone: normalizedPhone,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // 60 second resend cooldown
    if (
      existing?.lastSentAt &&
      Date.now() - existing.lastSentAt.getTime() < 60 * 1000
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Please wait before requesting another OTP.",
        },
        { status: 429 },
      );
    }

    const emailOtp = generateOtp();
    const phoneOtp = generateOtp();

    const emailOtpHash = hashOtp(emailOtp);
    const phoneOtpHash = hashOtp(phoneOtp);

    const expiresAt = getOtpExpiry();

    let verification;

    if (existing) {
      verification = await prisma.leadVerification.update({
        where: {
          id: existing.id,
        },
        data: {
          name,
          serviceId: serviceId ? Number(serviceId) : null,
          city: city || null,
          message: message || null,
          preferredStartTime: preferredStartTime || null,

          emailOtpHash,
          phoneOtpHash,

          emailVerified: false,
          phoneVerified: false,

          attempts: 0,
          lastSentAt: new Date(),
          expiresAt,
        },
      });
    } else {
      verification = await prisma.leadVerification.create({
        data: {
          name,
          email: normalizedEmail,
          phone: normalizedPhone,

          serviceId: serviceId ? Number(serviceId) : null,
          city: city || null,
          message: message || null,
          preferredStartTime: preferredStartTime || null,

          emailOtpHash,
          phoneOtpHash,

          expiresAt,
          lastSentAt: new Date(),
        },
      });
    }

    // Send email OTP
    const { error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
      to: normalizedEmail,
      subject: "Your Soclthry verification code",
      react: OTPEmail({
        otp: emailOtp,
      }),
    });

    if (error) {
      console.error("Resend error:", error);

      // Remove failed verification record
      await prisma.leadVerification.delete({
        where: {
          id: verification.id,
        },
      });

      return NextResponse.json(
        {
          success: false,
          message: "Unable to send verification email.",
        },
        { status: 500 },
      );
    }

    // DEV ONLY — phone OTP
    console.log(`[DEV ONLY] Phone OTP for ${normalizedPhone}: ${phoneOtp}`);

    return NextResponse.json({
      success: true,
      verificationId: verification.id,
      message: "OTP sent successfully.",
    });
  } catch (error) {
    console.error("OTP send error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to send OTP.",
      },
      { status: 500 },
    );
  }
}
