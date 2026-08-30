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

  try {
    const { id } = await params;
    const cityId = Number(id);

    if (!Number.isInteger(cityId) || cityId <= 0) {
      return NextResponse.json(
        { error: "Invalid city ID." },
        { status: 400 },
      );
    }

    const city = await prisma.city.findUnique({
      where: {
        id: cityId,
      },
    });

    if (!city) {
      return NextResponse.json(
        { error: "City not found." },
        { status: 404 },
      );
    }

    return NextResponse.json(city);
  } catch (error) {
    console.error("GET CITY ERROR:", error);

    return NextResponse.json(
      { error: "Unable to load city." },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: Props,
) {
  const auth = await requireAuth(request);

  if (!auth.authorized) return auth.response;

  try {
    const { id } = await params;
    const cityId = Number(id);

    if (!Number.isInteger(cityId) || cityId <= 0) {
      return NextResponse.json(
        { error: "Invalid city ID." },
        { status: 400 },
      );
    }

    const existingCity = await prisma.city.findUnique({
      where: {
        id: cityId,
      },

      select: {
        id: true,
      },
    });

    if (!existingCity) {
      return NextResponse.json(
        { error: "City not found." },
        { status: 404 },
      );
    }

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

    const city = await prisma.city.update({
      where: {
        id: cityId,
      },

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

    return NextResponse.json(city);
  } catch (error: any) {
    console.error("UPDATE CITY ERROR:", error);

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

    return NextResponse.json(
      {
        error: "Unable to update city.",
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
    const cityId = Number(id);

    if (!Number.isInteger(cityId) || cityId <= 0) {
      return NextResponse.json(
        {
          error: "Invalid city ID.",
        },
        {
          status: 400,
        },
      );
    }

    const city = await prisma.city.findUnique({
      where: {
        id: cityId,
      },

      select: {
        id: true,
        name: true,

        _count: {
          select: {
            serviceCities: true,
            testimonials: true,
            faqs: true,
          },
        },
      },
    });

    if (!city) {
      return NextResponse.json(
        {
          error: "City not found.",
        },
        {
          status: 404,
        },
      );
    }

    const {
      serviceCities,
      testimonials,
      faqs,
    } = city._count;

    const isInUse =
      serviceCities > 0 ||
      testimonials > 0 ||
      faqs > 0;

    if (isInUse) {
      return NextResponse.json(
        {
          error:
            `"${city.name}" cannot be deleted because it is currently in use. ` +
            `Service Pages: ${serviceCities}, ` +
            `Testimonials: ${testimonials}, ` +
            `FAQs: ${faqs}. Remove these connections first.`,
        },
        {
          status: 409,
        },
      );
    }

    await prisma.city.delete({
      where: {
        id: cityId,
      },
    });

    return NextResponse.json({
      success: true,
      message: "City deleted successfully.",
    });
  } catch (error: any) {
    console.error("DELETE CITY ERROR:", error);

    if (error?.code === "P2003") {
      return NextResponse.json(
        {
          error:
            "This city is connected to other content and cannot be deleted yet.",
        },
        {
          status: 409,
        },
      );
    }

    return NextResponse.json(
      {
        error: "Unable to delete city.",
      },
      {
        status: 500,
      },
    );
  }
}