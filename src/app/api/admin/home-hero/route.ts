import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/requireAuth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request);

  if (!auth.authorized) return auth.response;

  const hero = await prisma.homeHero.findUnique({
    where: {
      id: 1,
    },
  });

  return NextResponse.json(hero);
}

export async function PUT(request: NextRequest) {
  const auth = await requireAuth(request);

  if (!auth.authorized) return auth.response;

  const {
    badge,
    title,
    description,
    primaryButtonText,
    primaryButtonLink,
    secondaryButtonText,
    secondaryButtonLink,
    heroImage,
  } = await request.json();

  if (
    !badge ||
    !title ||
    !description ||
    !primaryButtonText ||
    !primaryButtonLink ||
    !heroImage
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

  const hero = await prisma.homeHero.upsert({
    where: {
      id: 1,
    },

    update: {
      badge,
      title,
      description,
      primaryButtonText,
      primaryButtonLink,

      secondaryButtonText:
        secondaryButtonText || null,

      secondaryButtonLink:
        secondaryButtonLink || null,

      heroImage,
    },

    create: {
      id: 1,
      badge,
      title,
      description,
      primaryButtonText,
      primaryButtonLink,

      secondaryButtonText:
        secondaryButtonText || null,

      secondaryButtonLink:
        secondaryButtonLink || null,

      heroImage,
    },
  });

  return NextResponse.json(hero);
}