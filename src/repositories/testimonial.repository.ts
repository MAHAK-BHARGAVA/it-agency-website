import { prisma } from "@/lib/prisma";

export async function getTestimonials() {
  return prisma.testimonial.findMany();
}