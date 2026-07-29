import { prisma } from "@/lib/prisma";

export async function getSite() {
  return prisma.siteSetting.findUnique({
    where: {
      id: 1,
    },
  });
}

export async function updateSite(data: {
  heroTitle?: string;
  heroDescription?: string;
}) {
  return prisma.siteSetting.update({
    where: {
      id: 1,
    },
    data,
  });
}
