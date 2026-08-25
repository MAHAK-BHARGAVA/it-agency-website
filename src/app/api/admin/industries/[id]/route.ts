import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/requireAuth";
import { NextRequest, NextResponse } from "next/server";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  request: NextRequest,
  { params }: Props,
) {
  const auth = await requireAuth(request);

  if (!auth.authorized) return auth.response;

  const { id } = await params;
  const industryId = Number(id);

  if (!Number.isInteger(industryId) || industryId <= 0) {
    return NextResponse.json(
      {
        message: "Invalid industry ID.",
      },
      {
        status: 400,
      },
    );
  }

  const industry = await prisma.industry.findUnique({
    where: {
      id: industryId,
    },
  });

  if (!industry) {
    return NextResponse.json(
      {
        message: "Industry not found.",
      },
      {
        status: 404,
      },
    );
  }

  return NextResponse.json(industry);
}

export async function PUT(
  request: NextRequest,
  { params }: Props,
) {
  const auth = await requireAuth(request);

  if (!auth.authorized) return auth.response;

  try {
    const { id } = await params;
    const industryId = Number(id);

    if (!Number.isInteger(industryId) || industryId <= 0) {
      return NextResponse.json(
        {
          message: "Invalid industry ID.",
        },
        {
          status: 400,
        },
      );
    }

    const {
      name,
      slug,
      description,
      metaTitle,
      metaDescription,
      canonicalUrl,
      ogImage,
    } = await request.json();

    if (!name?.trim() || !slug?.trim() || !description?.trim()) {
      return NextResponse.json(
        {
          message: "Name, slug and description are required.",
        },
        {
          status: 400,
        },
      );
    }

    const industry = await prisma.industry.update({
      where: {
        id: industryId,
      },

      data: {
        name: name.trim(),
        slug: slug.trim(),
        description: description.trim(),

        metaTitle: metaTitle?.trim() || null,
        metaDescription: metaDescription?.trim() || null,
        canonicalUrl: canonicalUrl?.trim() || null,
        ogImage: ogImage?.trim() || null,
      },
    });

    return NextResponse.json(industry);
  } catch (error) {
    console.error("UPDATE INDUSTRY ERROR:", error);

    return NextResponse.json(
      {
        message: "Unable to update industry.",
      },
      {
        status: 500,
      },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: Props,
) {
  const auth = await requireAuth(request);

  if (!auth.authorized) return auth.response;

  try {
    const { id } = await params;
    const industryId = Number(id);

    if (!Number.isInteger(industryId) || industryId <= 0) {
      return NextResponse.json(
        {
          message: "Invalid industry ID.",
        },
        {
          status: 400,
        },
      );
    }

    await prisma.industry.delete({
      where: {
        id: industryId,
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("DELETE INDUSTRY ERROR:", error);

    return NextResponse.json(
      {
        message: "Unable to delete industry.",
      },
      {
        status: 500,
      },
    );
  }
}