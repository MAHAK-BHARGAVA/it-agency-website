import type { getTestimonials } from "@/repositories/testimonial.repository";

export type TestimonialItem = Awaited<
  ReturnType<typeof getTestimonials>
>[number];