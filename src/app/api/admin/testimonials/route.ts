import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/requireAuth'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request)
  if (!auth.authorized) return auth.response
  const testimonials = await prisma.testimonial.findMany({
    include: { services: true, cities: true, industries: true },
  })
  return NextResponse.json(testimonials)
}

export async function POST(request: NextRequest) {
  const auth = await requireAuth(request)
  if (!auth.authorized) return auth.response
  const { clientName, company, quote, rating, serviceIds, cityIds, industryIds } = await request.json()

  const testimonial = await prisma.testimonial.create({
    data: {
      clientName,
      company,
      quote,
      rating,
      services: serviceIds ? { connect: serviceIds.map((id: number) => ({ id })) } : undefined,
      cities: cityIds ? { connect: cityIds.map((id: number) => ({ id })) } : undefined,
      industries: industryIds ? { connect: industryIds.map((id: number) => ({ id })) } : undefined,
    },
  })
  return NextResponse.json(testimonial, { status: 201 })
}