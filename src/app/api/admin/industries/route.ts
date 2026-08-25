import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/requireAuth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request);

  if (!auth.authorized) return auth.response;

  const industries = await prisma.industry.findMany({
    orderBy: {
      name: "asc",
    },

    include: {
      _count: {
        select: {
          serviceIndustries: true,
          portfolios: true,
          testimonials: true,
          faqs: true,
        },
      },
    },
  });

  return NextResponse.json(industries);
}

export async function POST(request: NextRequest) {
  const auth = await requireAuth(request);

  if (!auth.authorized) return auth.response;

  try {
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

    const industry = await prisma.industry.create({
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

    return NextResponse.json(industry, {
      status: 201,
    });
  } catch (error) {
    console.error("CREATE INDUSTRY ERROR:", error);

    return NextResponse.json(
      {
        message: "Unable to create industry.",
      },
      {
        status: 500,
      },
    );
  }
}