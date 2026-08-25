import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/requireAuth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request);

  if (!auth.authorized) return auth.response;

  const settings =
    await prisma.siteSetting.findUnique({
      where: {
        id: 1,
      },
    });

  return NextResponse.json(settings);
}

export async function PUT(request: NextRequest) {
  const auth = await requireAuth(request);

  if (!auth.authorized) return auth.response;

  const {
    companyName,
    logo,
    whiteLogo,
    favicon,

    phone,
    email,
    address,

    facebook,
    instagram,
    linkedin,
    twitter,
    youtube,

    salesEmail,
    seoEmail,
    aiEmail,
    supportEmail,
    mediaEmail,

    footerCopyright,
  } = await request.json();

  if (
    !companyName ||
    !logo ||
    !phone ||
    !email ||
    !address
  ) {
    return NextResponse.json(
      {
        error: "Please fill all required fields.",
      },
      {
        status: 400,
      },
    );
  }

  const settings =
    await prisma.siteSetting.upsert({
      where: {
        id: 1,
      },

      update: {
        companyName,
        logo,
        whiteLogo: whiteLogo || null,
        favicon: favicon || null,

        phone,
        email,
        address,

        facebook: facebook || null,
        instagram: instagram || null,
        linkedin: linkedin || null,
        twitter: twitter || null,
        youtube: youtube || null,

        salesEmail: salesEmail || null,
        seoEmail: seoEmail || null,
        aiEmail: aiEmail || null,
        supportEmail: supportEmail || null,
        mediaEmail: mediaEmail || null,

        footerCopyright:
          footerCopyright || null,
      },

      create: {
        id: 1,

        companyName,
        logo,
        whiteLogo: whiteLogo || null,
        favicon: favicon || null,

        phone,
        email,
        address,

        facebook: facebook || null,
        instagram: instagram || null,
        linkedin: linkedin || null,
        twitter: twitter || null,
        youtube: youtube || null,

        salesEmail: salesEmail || null,
        seoEmail: seoEmail || null,
        aiEmail: aiEmail || null,
        supportEmail: supportEmail || null,
        mediaEmail: mediaEmail || null,

        footerCopyright:
          footerCopyright || null,
      },
    });

  return NextResponse.json(settings);
}