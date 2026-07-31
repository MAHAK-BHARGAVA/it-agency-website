import { prisma } from "@/lib/prisma";

export async function getFooterData() {
  const [services, industries, cities] = await Promise.all([
    prisma.service.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
      },
      orderBy: {
        name: "asc",
      },
      take: 6,
    }),

    prisma.industry.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
      },
      orderBy: {
        name: "asc",
      },
      take: 6,
    }),

    prisma.city.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
      },
      orderBy: {
        name: "asc",
      },
      take: 6,
    }),
  ]);

  return {
    services,
    industries,
    cities,
  };
}