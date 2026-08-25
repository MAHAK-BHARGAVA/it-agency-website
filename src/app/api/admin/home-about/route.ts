import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/requireAuth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request);

  if (!auth.authorized) return auth.response;

  const about = await prisma.homeAbout.findUnique({
    where: {
      id: 1,
    },
  });

  return NextResponse.json(about);
}

export async function PUT(request: NextRequest) {
  const auth = await requireAuth(request);

  if (!auth.authorized) return auth.response;

  const {
    sectionTitle,
    title,
    description,
    experience,
    image,
    featureOne,
    featureTwo,
    featureThree,
  } = await request.json();

  if (
    !sectionTitle ||
    !title ||
    !description ||
    !image ||
    !featureOne ||
    !featureTwo
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

  const experienceNumber = Number(experience);

  if (
    !Number.isInteger(experienceNumber) ||
    experienceNumber < 0
  ) {
    return NextResponse.json(
      {
        error: "Experience must be a valid number.",
      },
      {
        status: 400,
      },
    );
  }

  const about = await prisma.homeAbout.upsert({
    where: {
      id: 1,
    },

    update: {
      sectionTitle,
      title,
      description,
      experience: experienceNumber,
      image,
      featureOne,
      featureTwo,
      featureThree: featureThree || null,
    },

    create: {
      id: 1,
      sectionTitle,
      title,
      description,
      experience: experienceNumber,
      image,
      featureOne,
      featureTwo,
      featureThree: featureThree || null,
    },
  });

  return NextResponse.json(about);
}