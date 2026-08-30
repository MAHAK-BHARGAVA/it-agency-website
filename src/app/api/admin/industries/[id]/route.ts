import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/requireAuth";
import { NextRequest, NextResponse } from "next/server";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

/* ======================================================
   GET SINGLE INDUSTRY
====================================================== */

export async function GET(
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
  } catch (error) {
    console.error("GET INDUSTRY ERROR:", error);

    return NextResponse.json(
      {
        message: "Unable to load industry.",
      },
      {
        status: 500,
      },
    );
  }
}

/* ======================================================
   UPDATE INDUSTRY
====================================================== */

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

    const existingIndustry =
      await prisma.industry.findUnique({
        where: {
          id: industryId,
        },

        select: {
          id: true,
        },
      });

    if (!existingIndustry) {
      return NextResponse.json(
        {
          message: "Industry not found.",
        },
        {
          status: 404,
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

    if (
      !name?.trim() ||
      !slug?.trim() ||
      !description?.trim()
    ) {
      return NextResponse.json(
        {
          message:
            "Name, slug and description are required.",
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
        metaDescription:
          metaDescription?.trim() || null,
        canonicalUrl:
          canonicalUrl?.trim() || null,
        ogImage: ogImage?.trim() || null,
      },
    });

    return NextResponse.json(industry);
  } catch (error: any) {
    console.error("UPDATE INDUSTRY ERROR:", error);

    if (error?.code === "P2002") {
      return NextResponse.json(
        {
          message:
            "An industry with this slug already exists.",
        },
        {
          status: 409,
        },
      );
    }

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

/* ======================================================
   DELETE INDUSTRY
====================================================== */

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

    /*
      Before deleting, check whether this industry
      is already being used anywhere.
    */

    const industry = await prisma.industry.findUnique({
      where: {
        id: industryId,
      },

      select: {
        id: true,
        name: true,

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

    const {
      serviceIndustries,
      portfolios,
      testimonials,
      faqs,
    } = industry._count;

    const isInUse =
      serviceIndustries > 0 ||
      portfolios > 0 ||
      testimonials > 0 ||
      faqs > 0;

    if (isInUse) {
      return NextResponse.json(
        {
          message:
            `"${industry.name}" cannot be deleted because it is currently in use. ` +
            `Service Pages: ${serviceIndustries}, ` +
            `Portfolios: ${portfolios}, ` +
            `Testimonials: ${testimonials}, ` +
            `FAQs: ${faqs}. Remove these connections first.`,
        },
        {
          status: 409,
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
      message: "Industry deleted successfully.",
    });
  } catch (error: any) {
    console.error("DELETE INDUSTRY ERROR:", error);

    if (error?.code === "P2003") {
      return NextResponse.json(
        {
          message:
            "This industry is connected to other content and cannot be deleted yet.",
        },
        {
          status: 409,
        },
      );
    }

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