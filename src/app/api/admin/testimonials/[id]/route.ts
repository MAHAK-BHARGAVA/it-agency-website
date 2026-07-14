import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/requireAuth'
import { NextRequest, NextResponse } from 'next/server'

type Props = { params: Promise<{ id: string }> }

export async function GET(request: NextRequest, { params }: Props) {
  const auth = await requireAuth(request)
  if (!auth.authorized) return auth.response
  const { id } = await params
  const testimonial = await prisma.testimonial.findUnique({
    where: { id: Number(id) },
    include: { services: true, cities: true, industries: true },
  })
  if (!testimonial) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(testimonial)
}

export async function PUT(request: NextRequest, { params }: Props) {
  const auth = await requireAuth(request)
  if (!auth.authorized) return auth.response
  const { id } = await params
  const { clientName, company, quote, rating, serviceIds } = await request.json()

  const testimonial = await prisma.testimonial.update({
    where: { id: Number(id) },
    data: {
      clientName,
      company,
      quote,
      rating,
      services: serviceIds ? { set: serviceIds.map((sid: number) => ({ id: sid })) } : undefined,
    },
  })
  return NextResponse.json(testimonial)
}

export async function DELETE(request: NextRequest, { params }: Props) {
  const auth = await requireAuth(request)
  if (!auth.authorized) return auth.response
  const { id } = await params
  await prisma.testimonial.delete({ where: { id: Number(id) } })
  return NextResponse.json({ success: true })
}