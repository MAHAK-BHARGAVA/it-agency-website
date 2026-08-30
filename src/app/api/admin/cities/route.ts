// src/app/api/admin/cities/route.ts

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/requireAuth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request);

  if (!auth.authorized) return auth.response;

  try {
    const cities = await prisma.city.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(cities);
  } catch (error) {
    console.error("GET CITIES ERROR:", error);

    return NextResponse.json(
      {
        error: "Unable to load cities.",
      },
      {
        status: 500,
      },
    );
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireAuth(request);

  if (!auth.authorized) return auth.response;

  try {
    const {
      name,
      slug,
      stateId,
      metaTitle,
      metaDescription,
      canonicalUrl,
      ogImage,
    } = await request.json();

    if (!name?.trim() || !slug?.trim()) {
      return NextResponse.json(
        {
          error: "City name and slug are required.",
        },
        {
          status: 400,
        },
      );
    }

    let normalizedStateId: number | null = null;

    if (stateId) {
      normalizedStateId = Number(stateId);

      if (
        !Number.isInteger(normalizedStateId) ||
        normalizedStateId <= 0
      ) {
        return NextResponse.json(
          {
            error: "Invalid state selected.",
          },
          {
            status: 400,
          },
        );
      }

      const stateExists = await prisma.state.findUnique({
        where: {
          id: normalizedStateId,
        },

        select: {
          id: true,
        },
      });

      if (!stateExists) {
        return NextResponse.json(
          {
            error: "Selected state does not exist.",
          },
          {
            status: 400,
          },
        );
      }
    }

    const city = await prisma.city.create({
      data: {
        name: name.trim(),
        slug: slug.trim(),

        stateId: normalizedStateId,

        metaTitle: metaTitle?.trim() || null,
        metaDescription:
          metaDescription?.trim() || null,
        canonicalUrl:
          canonicalUrl?.trim() || null,
        ogImage: ogImage?.trim() || null,
      },
    });

    return NextResponse.json(city, {
      status: 201,
    });
  } catch (error: any) {
    console.error("CREATE CITY ERROR:", error);

    if (error?.code === "P2002") {
      return NextResponse.json(
        {
          error:
            "A city with this slug already exists.",
        },
        {
          status: 409,
        },
      );
    }

    if (error?.code === "P2003") {
      return NextResponse.json(
        {
          error:
            "The selected state is invalid.",
        },
        {
          status: 400,
        },
      );
    }

    return NextResponse.json(
      {
        error: "Unable to create city.",
      },
      {
        status: 500,
      },
    );
  }
}