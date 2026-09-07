import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/requireAuth";
import { NextRequest, NextResponse } from "next/server";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

function getValidId(id: string) {
  const parsedId = Number(id);

  if (!Number.isInteger(parsedId) || parsedId <= 0) {
    return null;
  }

  return parsedId;
}

function isValidUrl(value: unknown) {
  if (!value) return true;

  if (typeof value !== "string") return false;

  try {
    const url = new URL(value);

    return ["http:", "https:"].includes(url.protocol);
  } catch {
    return false;
  }
}

function getPrismaErrorCode(error: unknown) {
  if (
    error &&
    typeof error === "object" &&
    "code" in error
  ) {
    return (error as { code: string }).code;
  }

  return null;
}

export async function GET(
  request: NextRequest,
  { params }: Props,
) {
  const auth = await requireAuth(request);

  if (!auth.authorized) {
    return auth.response;
  }

  const { id } = await params;
  const projectId = getValidId(id);

  if (!projectId) {
    return NextResponse.json(
      { error: "Invalid project ID" },
      { status: 400 },
    );
  }

  try {
    const project = await prisma.portfolio.findUnique({
      where: {
        id: projectId,
      },
      include: {
        services: true,
        industries: true,
        testimonial: true,
      },
    });

    if (!project) {
      return NextResponse.json(
        { error: "Portfolio project not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error("Failed to fetch portfolio project:", error);

    return NextResponse.json(
      { error: "Failed to fetch portfolio project" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: Props,
) {
  const auth = await requireAuth(request);

  if (!auth.authorized) {
    return auth.response;
  }

  const { id } = await params;
  const projectId = getValidId(id);

  if (!projectId) {
    return NextResponse.json(
      { error: "Invalid project ID" },
      { status: 400 },
    );
  }

  try {
    const body = await request.json();

    const {
      projectName,
      slug,
      resultSummary,
      clientName,
      projectUrl,
      thumbnail,
      serviceIds,
      industryIds,
      challenge,
      solution,
      process,
      testimonialId,
    } = body;

    // Required fields
    if (
      typeof projectName !== "string" ||
      !projectName.trim() ||
      typeof slug !== "string" ||
      !slug.trim() ||
      typeof resultSummary !== "string" ||
      !resultSummary.trim()
    ) {
      return NextResponse.json(
        {
          error:
            "Project name, slug and result summary are required",
        },
        { status: 400 },
      );
    }

    // URL validation
    if (!isValidUrl(projectUrl)) {
      return NextResponse.json(
        {
          error:
            "Project URL must be a valid http or https URL",
        },
        { status: 400 },
      );
    }

    // Normalize relation IDs
    const normalizedServiceIds = Array.isArray(serviceIds)
      ? serviceIds
          .map(Number)
          .filter(
            (id: number) =>
              Number.isInteger(id) && id > 0,
          )
      : [];

    const normalizedIndustryIds = Array.isArray(
      industryIds,
    )
      ? industryIds
          .map(Number)
          .filter(
            (id: number) =>
              Number.isInteger(id) && id > 0,
          )
      : [];

    const normalizedTestimonialId = testimonialId
      ? Number(testimonialId)
      : null;

    if (
      normalizedTestimonialId !== null &&
      (!Number.isInteger(normalizedTestimonialId) ||
        normalizedTestimonialId <= 0)
    ) {
      return NextResponse.json(
        { error: "Invalid testimonial ID" },
        { status: 400 },
      );
    }

    const project = await prisma.portfolio.update({
      where: {
        id: projectId,
      },

      data: {
        projectName: projectName.trim(),
        slug: slug.trim(),
        resultSummary: resultSummary.trim(),

        clientName:
          typeof clientName === "string" &&
          clientName.trim()
            ? clientName.trim()
            : null,

        projectUrl:
          typeof projectUrl === "string" &&
          projectUrl.trim()
            ? projectUrl.trim()
            : null,

        thumbnail: thumbnail || null,

        challenge:
          typeof challenge === "string" &&
          challenge.trim()
            ? challenge.trim()
            : null,

        solution:
          typeof solution === "string" &&
          solution.trim()
            ? solution.trim()
            : null,

        process:
          typeof process === "string" &&
          process.trim()
            ? process.trim()
            : null,

        testimonialId: normalizedTestimonialId,

        services: {
          set: normalizedServiceIds.map((sid) => ({
            id: sid,
          })),
        },

        industries: {
          set: normalizedIndustryIds.map((iid) => ({
            id: iid,
          })),
        },
      },

      include: {
        services: true,
        industries: true,
        testimonial: true,
      },
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error(
      "Failed to update portfolio project:",
      error,
    );

    const errorCode = getPrismaErrorCode(error);

    if (errorCode === "P2002") {
      return NextResponse.json(
        {
          error:
            "A portfolio project with this slug or testimonial already exists",
        },
        { status: 409 },
      );
    }

    if (errorCode === "P2003") {
      return NextResponse.json(
        {
          error:
            "One or more selected services, industries, or testimonial are invalid",
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "Failed to update portfolio project" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: Props,
) {
  const auth = await requireAuth(request);

  if (!auth.authorized) {
    return auth.response;
  }

  const { id } = await params;
  const projectId = getValidId(id);

  if (!projectId) {
    return NextResponse.json(
      { error: "Invalid project ID" },
      { status: 400 },
    );
  }

  try {
    await prisma.portfolio.delete({
      where: {
        id: projectId,
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "Failed to delete portfolio project:",
      error,
    );

    const errorCode = getPrismaErrorCode(error);

    if (errorCode === "P2025") {
      return NextResponse.json(
        { error: "Portfolio project not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { error: "Failed to delete portfolio project" },
      { status: 500 },
    );
  }
}