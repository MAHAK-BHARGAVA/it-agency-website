import { prisma } from "@/lib/prisma";

export async function getTestimonials() {
  return prisma.testimonial.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 6,
    select: {
      id: true,
      clientName: true,
      company: true,
      quote: true,
      rating: true,
      photo: true,
    },
  });
}