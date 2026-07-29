import { prisma } from "@/lib/prisma";

export async function getFaqs() {
  return prisma.faq.findMany();
}