import { prisma } from "@/lib/prisma";

export async function createLead(data: {
  name: string;
  phone: string;
  serviceId: number;
  preferredStartTime: string;
}) {
  return prisma.lead.create({
    data,
  });
}