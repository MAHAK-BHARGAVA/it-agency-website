import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/requireAuth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request);

  if (!auth.authorized) {
    return auth.response;
  }

  try {
    const combinations = await prisma.serviceState.findMany({
      include: {
        service: true,
        state: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(combinations);
  } catch (error) {
    console.error("GET service-state error:", error);

    return NextResponse.json(
      { error: "Failed to fetch service-state content" },
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
      stateId,
      metaTitle,
      metaDescription,
      heroHeading,
      introText,
    } = await request.json();

    if (!serviceId || !stateId) {
      return NextResponse.json(
        { error: "Service and state are required" },
        { status: 400 }
      );
    }

    const combination = await prisma.serviceState.upsert({
      where: {
        serviceId_stateId: {
          serviceId: Number(serviceId),
          stateId: Number(stateId),
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
        stateId: Number(stateId),
        metaTitle: metaTitle || null,
        metaDescription: metaDescription || null,
        heroHeading: heroHeading || null,
        introText: introText || null,
      },
    });

    return NextResponse.json(combination, { status: 201 });
  } catch (error) {
    console.error("POST service-state error:", error);

    return NextResponse.json(
      { error: "Failed to save service-state content" },
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
    const { serviceId, stateId } = await request.json();

    if (!serviceId || !stateId) {
      return NextResponse.json(
        { error: "Service and state are required" },
        { status: 400 }
      );
    }

    await prisma.serviceState.delete({
      where: {
        serviceId_stateId: {
          serviceId: Number(serviceId),
          stateId: Number(stateId),
        },
      },
    });

    return NextResponse.json({
      message: "Service-state content deleted successfully",
    });
  } catch (error: any) {
    console.error("DELETE service-state error:", error);

    if (error?.code === "P2025") {
      return NextResponse.json(
        { error: "Content not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Failed to delete service-state content" },
      { status: 500 }
    );
  }
}