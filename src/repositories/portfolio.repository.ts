import { prisma } from "@/lib/prisma";

export async function getPortfolio(limit = 3) {
  return prisma.portfolio.findMany({
    take: limit,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      services: true,
      industries: true,
    },
  });
}

export async function getPortfolioBySlug(slug: string) {
  return prisma.portfolio.findUnique({
    where: {
      slug,
    },
    include: {
      services: true,
      industries: true,
      testimonial: true,
    },
  });
}