"use server";

import { getSite } from "@/repositories/site.repository";

export async function getSiteAction() {
  return await getSite();
}