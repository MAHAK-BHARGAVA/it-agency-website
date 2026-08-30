import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/requireAuth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request);

  if (!auth.authorized) return auth.response;

  const testimonials = await prisma.testimonial.findMany({
    include: {
      services: true,
      cities: true,
      industries: true,
    },
  });

  return NextResponse.json(testimonials);
}

export async function POST(request: NextRequest) {
  const auth = await requireAuth(request);

  if (!auth.authorized) return auth.response;

  const {
    clientName,
    company,
    quote,
    rating,
    photo,
    serviceIds,
    cityIds,
    industryIds,
  } = await request.json();

  if (!clientName?.trim() || !quote?.trim()) {
    return NextResponse.json(
      {
        error: "Client name and testimonial are required.",
      },
      {
        status: 400,
      },
    );
  }

  const testimonial = await prisma.testimonial.create({
    data: {
      clientName: clientName.trim(),
      company: company?.trim() || null,
      quote: quote.trim(),
      rating,
      photo: photo?.trim() || null,

      services: serviceIds
        ? {
            connect: serviceIds.map((id: number) => ({
              id,
            })),
          }
        : undefined,

      cities: cityIds
        ? {
            connect: cityIds.map((id: number) => ({
              id,
            })),
          }
        : undefined,

      industries: industryIds
        ? {
            connect: industryIds.map((id: number) => ({
              id,
            })),
          }
        : undefined,
    },
  });

  return NextResponse.json(testimonial, {
    status: 201,
  });
}