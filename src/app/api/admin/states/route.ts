import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/requireAuth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request);

  if (!auth.authorized) return auth.response;

  try {
    const states = await prisma.state.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(states);
  } catch (error) {
    console.error("GET STATES ERROR:", error);

    return NextResponse.json(
      {
        error: "Unable to load states.",
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
      metaTitle,
      metaDescription,
      canonicalUrl,
      ogImage,
    } = await request.json();

    if (!name?.trim() || !slug?.trim()) {
      return NextResponse.json(
        {
          error: "State name and slug are required.",
        },
        {
          status: 400,
        },
      );
    }

    const state = await prisma.state.create({
      data: {
        name: name.trim(),
        slug: slug.trim(),

        metaTitle: metaTitle?.trim() || null,
        metaDescription:
          metaDescription?.trim() || null,
        canonicalUrl:
          canonicalUrl?.trim() || null,
        ogImage: ogImage?.trim() || null,
      },
    });

    return NextResponse.json(state, {
      status: 201,
    });
  } catch (error: any) {
    console.error("CREATE STATE ERROR:", error);

    if (error?.code === "P2002") {
      return NextResponse.json(
        {
          error:
            "A state with this slug already exists.",
        },
        {
          status: 409,
        },
      );
    }

    return NextResponse.json(
      {
        error: "Unable to create state.",
      },
      {
        status: 500,
      },
    );
  }
}