import { prisma } from "@/lib/prisma";

export async function getPortfolio() {
  return prisma.portfolio.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      services: true,
      industries: true,
    },
     take: 4,
  });
}

export async function getAllPortfolio() {
  return prisma.portfolio.findMany({
    orderBy: {
      createdAt: "desc",
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