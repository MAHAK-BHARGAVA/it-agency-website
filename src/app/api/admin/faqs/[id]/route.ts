import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/requireAuth'
import { NextRequest, NextResponse } from 'next/server'

type Props = { params: Promise<{ id: string }> }

export async function GET(request: NextRequest, { params }: Props) {
  const auth = await requireAuth(request)
  if (!auth.authorized) return auth.response
  const { id } = await params
  const faq = await prisma.faq.findUnique({
    where: { id: Number(id) },
    include: { services: true, cities: true, states: true, industries: true },
  })
  if (!faq) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(faq)
}

export async function PUT(request: NextRequest, { params }: Props) {
  const auth = await requireAuth(request)
  if (!auth.authorized) return auth.response
  const { id } = await params
  const { question, answer, serviceIds, cityIds, stateIds, industryIds } = await request.json()

  const faq = await prisma.faq.update({
    where: { id: Number(id) },
   data: {
  question,
  answer,

  services: serviceIds
    ? {
        set: serviceIds.map((id: number) => ({ id })),
      }
    : undefined,

  cities: cityIds
    ? {
        set: cityIds.map((id: number) => ({ id })),
      }
    : undefined,

  states: stateIds
    ? {
        set: stateIds.map((id: number) => ({ id })),
      }
    : undefined,

  industries: industryIds
    ? {
        set: industryIds.map((id: number) => ({ id })),
      }
    : undefined,
},
  })
  return NextResponse.json(faq)
}

export async function DELETE(request: NextRequest, { params }: Props) {
  const auth = await requireAuth(request)
  if (!auth.authorized) return auth.response
  const { id } = await params
  await prisma.faq.delete({ where: { id: Number(id) } })
  return NextResponse.json({ success: true })
}