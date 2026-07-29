import { prisma } from "@/lib/prisma";

export async function getServices() {
  return prisma.service.findMany({
    orderBy: {
      createdAt: "asc",
    },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      image: true,
    },
  });
}

export async function getServiceBySlug(slug: string) {
  return prisma.service.findUnique({
    where: {
      slug,
    },
    include: {
      serviceCities: {
        include: {
          city: true,
        },
      },
      serviceStates: {
        include: {
          state: true,
        },
      },
      serviceIndustries: {
        include: {
          industry: true,
        },
      },
    },
  });
}