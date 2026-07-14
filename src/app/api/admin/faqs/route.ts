import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/requireAuth'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request)
  if (!auth.authorized) return auth.response
  const faqs = await prisma.faq.findMany({
    include: { services: true, cities: true, states: true, industries: true },
  })
  return NextResponse.json(faqs)
}

export async function POST(request: NextRequest) {
  const auth = await requireAuth(request)
  if (!auth.authorized) return auth.response
  const { question, answer, serviceIds, cityIds, stateIds, industryIds } = await request.json()

  const faq = await prisma.faq.create({
    data: {
      question,
      answer,
      services: serviceIds ? { connect: serviceIds.map((id: number) => ({ id })) } : undefined,
      cities: cityIds ? { connect: cityIds.map((id: number) => ({ id })) } : undefined,
      states: stateIds ? { connect: stateIds.map((id: number) => ({ id })) } : undefined,
      industries: industryIds ? { connect: industryIds.map((id: number) => ({ id })) } : undefined,
    },
  })
  return NextResponse.json(faq, { status: 201 })
}