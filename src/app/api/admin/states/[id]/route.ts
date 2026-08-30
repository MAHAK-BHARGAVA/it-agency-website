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
    const stateId = Number(id);

    if (!Number.isInteger(stateId) || stateId <= 0) {
      return NextResponse.json(
        {
          error: "Invalid state ID.",
        },
        {
          status: 400,
        },
      );
    }

    const state = await prisma.state.findUnique({
      where: {
        id: stateId,
      },
    });

    if (!state) {
      return NextResponse.json(
        {
          error: "State not found.",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json(state);
  } catch (error) {
    console.error("GET STATE ERROR:", error);

    return NextResponse.json(
      {
        error: "Unable to load state.",
      },
      {
        status: 500,
      },
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
    const stateId = Number(id);

    if (!Number.isInteger(stateId) || stateId <= 0) {
      return NextResponse.json(
        {
          error: "Invalid state ID.",
        },
        {
          status: 400,
        },
      );
    }

    const existingState =
      await prisma.state.findUnique({
        where: {
          id: stateId,
        },

        select: {
          id: true,
        },
      });

    if (!existingState) {
      return NextResponse.json(
        {
          error: "State not found.",
        },
        {
          status: 404,
        },
      );
    }

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
          error:
            "State name and slug are required.",
        },
        {
          status: 400,
        },
      );
    }

    const state = await prisma.state.update({
      where: {
        id: stateId,
      },

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

    return NextResponse.json(state);
  } catch (error: any) {
    console.error("UPDATE STATE ERROR:", error);

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
        error: "Unable to update state.",
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
    const stateId = Number(id);

    if (!Number.isInteger(stateId) || stateId <= 0) {
      return NextResponse.json(
        {
          error: "Invalid state ID.",
        },
        {
          status: 400,
        },
      );
    }

    const state = await prisma.state.findUnique({
      where: {
        id: stateId,
      },

      select: {
        id: true,
        name: true,

        _count: {
          select: {
            cities: true,
            serviceStates: true,
            faqs: true,
          },
        },
      },
    });

    if (!state) {
      return NextResponse.json(
        {
          error: "State not found.",
        },
        {
          status: 404,
        },
      );
    }

    const {
      cities,
      serviceStates,
      faqs,
    } = state._count;

    const isInUse =
      cities > 0 ||
      serviceStates > 0 ||
      faqs > 0;

    if (isInUse) {
      return NextResponse.json(
        {
          error:
            `"${state.name}" cannot be deleted because it is currently in use. ` +
            `Cities: ${cities}, ` +
            `Service Pages: ${serviceStates}, ` +
            `FAQs: ${faqs}. Remove these connections first.`,
        },
        {
          status: 409,
        },
      );
    }

    await prisma.state.delete({
      where: {
        id: stateId,
      },
    });

    return NextResponse.json({
      success: true,
      message: "State deleted successfully.",
    });
  } catch (error: any) {
    console.error("DELETE STATE ERROR:", error);

    if (error?.code === "P2003") {
      return NextResponse.json(
        {
          error:
            "This state is connected to other content and cannot be deleted yet.",
        },
        {
          status: 409,
        },
      );
    }

    return NextResponse.json(
      {
        error: "Unable to delete state.",
      },
      {
        status: 500,
      },
    );
  }
}