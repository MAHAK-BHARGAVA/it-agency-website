import type { getFAQs } from "@/repositories/faq.repository";

export type FAQItemType = Awaited<
  ReturnType<typeof getFAQs>
>[number];