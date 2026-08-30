import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/requireAuth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request);

  if (!auth.authorized) {
    return auth.response;
  }

  try {
    const combinations = await prisma.serviceIndustry.findMany({
      include: {
        service: true,
        industry: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(combinations);
  } catch (error) {
    console.error("GET service-industry error:", error);

    return NextResponse.json(
      { error: "Failed to fetch service-industry content" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireAuth(request);

  if (!auth.authorized) {
    return auth.response;
  }

  try {
    const {
      serviceId,
      industryId,
      metaTitle,
      metaDescription,
      heroHeading,
      introText,
    } = await request.json();

    if (!serviceId || !industryId) {
      return NextResponse.json(
        { error: "Service and industry are required" },
        { status: 400 }
      );
    }

    const combination = await prisma.serviceIndustry.upsert({
      where: {
        serviceId_industryId: {
          serviceId: Number(serviceId),
          industryId: Number(industryId),
        },
      },

      update: {
        metaTitle: metaTitle || null,
        metaDescription: metaDescription || null,
        heroHeading: heroHeading || null,
        introText: introText || null,
      },

      create: {
        serviceId: Number(serviceId),
        industryId: Number(industryId),
        metaTitle: metaTitle || null,
        metaDescription: metaDescription || null,
        heroHeading: heroHeading || null,
        introText: introText || null,
      },
    });

    return NextResponse.json(combination, { status: 201 });
  } catch (error) {
    console.error("POST service-industry error:", error);

    return NextResponse.json(
      { error: "Failed to save service-industry content" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const auth = await requireAuth(request);

  if (!auth.authorized) {
    return auth.response;
  }

  try {
    const { serviceId, industryId } = await request.json();

    if (!serviceId || !industryId) {
      return NextResponse.json(
        { error: "Service and industry are required" },
        { status: 400 }
      );
    }

    await prisma.serviceIndustry.delete({
      where: {
        serviceId_industryId: {
          serviceId: Number(serviceId),
          industryId: Number(industryId),
        },
      },
    });

    return NextResponse.json({
      message: "Service-industry content deleted successfully",
    });
  } catch (error: any) {
    console.error("DELETE service-industry error:", error);

    if (error?.code === "P2025") {
      return NextResponse.json(
        { error: "Content not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Failed to delete service-industry content" },
      { status: 500 }
    );
  }
}