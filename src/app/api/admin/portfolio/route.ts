import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/requireAuth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request);

  if (!auth.authorized) return auth.response;

  try {
    const projects = await prisma.portfolio.findMany({
      include: {
        services: true,
        industries: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error("Failed to fetch portfolio projects:", error);

    return NextResponse.json(
      { error: "Failed to fetch portfolio projects" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireAuth(request);

  if (!auth.authorized) return auth.response;

  try {
    const body = await request.json();

    const {
      projectName,
      slug,
      resultSummary,
      clientName,
      projectUrl,
      thumbnail,
      challenge,
      solution,
      process,
      testimonialId,
      serviceIds,
      industryIds,
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
          error: "Project name, slug and result summary are required",
        },
        { status: 400 },
      );
    }

    // Validate URL if provided
    if (projectUrl) {
      try {
        const url = new URL(projectUrl);

        if (!["http:", "https:"].includes(url.protocol)) {
          return NextResponse.json(
            { error: "Project URL must use http or https" },
            { status: 400 },
          );
        }
      } catch {
        return NextResponse.json(
          { error: "Invalid project URL" },
          { status: 400 },
        );
      }
    }

    // Normalize IDs
    const normalizedServiceIds = Array.isArray(serviceIds)
      ? serviceIds.map(Number).filter(Number.isInteger)
      : [];

    const normalizedIndustryIds = Array.isArray(industryIds)
      ? industryIds.map(Number).filter(Number.isInteger)
      : [];

    const normalizedTestimonialId = testimonialId
      ? Number(testimonialId)
      : null;

    if (
      normalizedTestimonialId !== null &&
      !Number.isInteger(normalizedTestimonialId)
    ) {
      return NextResponse.json(
        { error: "Invalid testimonial ID" },
        { status: 400 },
      );
    }

    const project = await prisma.portfolio.create({
      data: {
        projectName: projectName.trim(),
        slug: slug.trim(),
        resultSummary: resultSummary.trim(),
        clientName: clientName?.trim() || null,
        projectUrl: projectUrl?.trim() || null,
        thumbnail: thumbnail || null,
        challenge: challenge?.trim() || null,
        solution: solution?.trim() || null,
        process: process?.trim() || null,

        testimonialId: normalizedTestimonialId,

        services:
          normalizedServiceIds.length > 0
            ? {
                connect: normalizedServiceIds.map((id) => ({ id })),
              }
            : undefined,

        industries:
          normalizedIndustryIds.length > 0
            ? {
                connect: normalizedIndustryIds.map((id) => ({ id })),
              }
            : undefined,
      },
      include: {
        services: true,
        industries: true,
        testimonial: true,
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("Failed to create portfolio project:", error);

    if (error && typeof error === "object" && "code" in error) {
      const prismaError = error as { code: string };

      if (prismaError.code === "P2002") {
        return NextResponse.json(
          {
            error: "A portfolio project with this slug already exists",
          },
          { status: 409 },
        );
      }

      if (prismaError.code === "P2003") {
        return NextResponse.json(
          {
            error:
              "One or more selected services, industries, or testimonial are invalid",
          },
          { status: 400 },
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to create portfolio project" },
      { status: 500 },
    );
  }
}
