import { prisma } from "@/lib/prisma";

export async function getFAQs() {
  return prisma.faq.findMany({
    orderBy: {
      createdAt: "asc",
    },
    select: {
      id: true,
      question: true,
      answer: true,
    },
  });
}