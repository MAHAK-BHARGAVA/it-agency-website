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
    const serviceId = Number(id);

    if (!Number.isInteger(serviceId) || serviceId <= 0) {
      return NextResponse.json(
        { error: "Invalid service ID." },
        { status: 400 },
      );
    }

    const service = await prisma.service.findUnique({
      where: {
        id: serviceId,
      },

      include: {
        serviceCities: {
          select: {
            cityId: true,
          },
        },

        serviceStates: {
          select: {
            stateId: true,
          },
        },

        serviceIndustries: {
          select: {
            industryId: true,
          },
        },
      },
    });

    if (!service) {
      return NextResponse.json(
        { error: "Service not found." },
        { status: 404 },
      );
    }

    return NextResponse.json(service);
  } catch (error) {
    console.error("GET SERVICE ERROR:", error);

    return NextResponse.json(
      { error: "Unable to fetch service." },
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
    const serviceId = Number(id);

    if (!Number.isInteger(serviceId) || serviceId <= 0) {
      return NextResponse.json(
        { error: "Invalid service ID." },
        { status: 400 },
      );
    }

    const body = await request.json();

    const {
      name,
      slug,
      description,
      metaTitle,
      metaDescription,
      canonicalUrl,
      ogImage,
      image,
      cityIds = [],
      stateIds = [],
      industryIds = [],
    } = body;

    if (
      !name?.trim() ||
      !slug?.trim() ||
      !description?.trim()
    ) {
      return NextResponse.json(
        {
          error:
            "Name, slug and description are required.",
        },
        { status: 400 },
      );
    }

    const normalizeIds = (
      ids: Array<number | string>,
    ) => {
      return [
        ...new Set(
          ids
            .map((value) => Number(value))
            .filter(
              (value) =>
                Number.isInteger(value) &&
                value > 0,
            ),
        ),
      ];
    };

    const newCityIds = normalizeIds(cityIds);
    const newStateIds = normalizeIds(stateIds);
    const newIndustryIds =
      normalizeIds(industryIds);

    const existingService =
      await prisma.service.findUnique({
        where: {
          id: serviceId,
        },

        select: {
          id: true,

          serviceCities: {
            select: {
              cityId: true,
            },
          },

          serviceStates: {
            select: {
              stateId: true,
            },
          },

          serviceIndustries: {
            select: {
              industryId: true,
            },
          },
        },
      });

    if (!existingService) {
      return NextResponse.json(
        { error: "Service not found." },
        { status: 404 },
      );
    }

    const existingCityIds =
      existingService.serviceCities.map(
        (item) => item.cityId,
      );

    const existingStateIds =
      existingService.serviceStates.map(
        (item) => item.stateId,
      );

    const existingIndustryIds =
      existingService.serviceIndustries.map(
        (item) => item.industryId,
      );

    const citiesToAdd = newCityIds.filter(
      (cityId) =>
        !existingCityIds.includes(cityId),
    );

    const citiesToRemove =
      existingCityIds.filter(
        (cityId) =>
          !newCityIds.includes(cityId),
      );

    const statesToAdd = newStateIds.filter(
      (stateId) =>
        !existingStateIds.includes(stateId),
    );

    const statesToRemove =
      existingStateIds.filter(
        (stateId) =>
          !newStateIds.includes(stateId),
      );

    const industriesToAdd =
      newIndustryIds.filter(
        (industryId) =>
          !existingIndustryIds.includes(
            industryId,
          ),
      );

    const industriesToRemove =
      existingIndustryIds.filter(
        (industryId) =>
          !newIndustryIds.includes(industryId),
      );

    await prisma.$transaction([
      prisma.serviceCity.deleteMany({
        where: {
          serviceId,

          ...(citiesToRemove.length > 0
            ? {
                cityId: {
                  in: citiesToRemove,
                },
              }
            : {
                id: {
                  in: [],
                },
              }),
        },
      }),

      prisma.serviceState.deleteMany({
        where: {
          serviceId,

          ...(statesToRemove.length > 0
            ? {
                stateId: {
                  in: statesToRemove,
                },
              }
            : {
                id: {
                  in: [],
                },
              }),
        },
      }),

      prisma.serviceIndustry.deleteMany({
        where: {
          serviceId,

          ...(industriesToRemove.length > 0
            ? {
                industryId: {
                  in: industriesToRemove,
                },
              }
            : {
                id: {
                  in: [],
                },
              }),
        },
      }),

      ...(citiesToAdd.length > 0
        ? [
            prisma.serviceCity.createMany({
              data: citiesToAdd.map(
                (cityId) => ({
                  serviceId,
                  cityId,
                }),
              ),

              skipDuplicates: true,
            }),
          ]
        : []),

      ...(statesToAdd.length > 0
        ? [
            prisma.serviceState.createMany({
              data: statesToAdd.map(
                (stateId) => ({
                  serviceId,
                  stateId,
                }),
              ),

              skipDuplicates: true,
            }),
          ]
        : []),

      ...(industriesToAdd.length > 0
        ? [
            prisma.serviceIndustry.createMany({
              data: industriesToAdd.map(
                (industryId) => ({
                  serviceId,
                  industryId,
                }),
              ),

              skipDuplicates: true,
            }),
          ]
        : []),

      prisma.service.update({
        where: {
          id: serviceId,
        },

        data: {
          name: name.trim(),
          slug: slug.trim(),
          description: description.trim(),

          metaTitle:
            metaTitle?.trim() || null,

          metaDescription:
            metaDescription?.trim() || null,

          canonicalUrl:
            canonicalUrl?.trim() || null,

          ogImage:
            ogImage?.trim() || null,

          image:
            image?.trim() || null,
        },
      }),
    ]);

    const updatedService =
      await prisma.service.findUnique({
        where: {
          id: serviceId,
        },

        include: {
          serviceCities: true,
          serviceStates: true,
          serviceIndustries: true,
        },
      });

    return NextResponse.json(updatedService);
  } catch (error: any) {
    console.error(
      "UPDATE SERVICE ERROR:",
      error,
    );

    if (error?.code === "P2002") {
      return NextResponse.json(
        {
          error:
            "A service with this slug already exists.",
        },
        { status: 409 },
      );
    }

    if (error?.code === "P2003") {
      return NextResponse.json(
        {
          error:
            "One or more selected targets are invalid.",
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        error: "Unable to update service.",
      },
      { status: 500 },
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
    const serviceId = Number(id);

    if (!Number.isInteger(serviceId) || serviceId <= 0) {
      return NextResponse.json(
        { error: "Invalid service ID." },
        { status: 400 },
      );
    }

    const service =
      await prisma.service.findUnique({
        where: {
          id: serviceId,
        },

        select: {
          id: true,
        },
      });

    if (!service) {
      return NextResponse.json(
        { error: "Service not found." },
        { status: 404 },
      );
    }

    await prisma.service.delete({
      where: {
        id: serviceId,
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "DELETE SERVICE ERROR:",
      error,
    );

    return NextResponse.json(
      {
        error: "Unable to delete service.",
      },
      { status: 500 },
    );
  }
}