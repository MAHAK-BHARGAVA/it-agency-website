import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/requireAuth'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request)
  if (!auth.authorized) return auth.response
  const combos = await prisma.serviceCity.findMany({ include: { service: true, city: true } })
  return NextResponse.json(combos)
}

export async function POST(request: NextRequest) {
  const auth = await requireAuth(request)
  if (!auth.authorized) return auth.response
  const { serviceId, cityId, metaTitle, metaDescription, heroHeading, introText } = await request.json()

  const combo = await prisma.serviceCity.upsert({
    where: { serviceId_cityId: { serviceId: Number(serviceId), cityId: Number(cityId) } },
    update: { metaTitle, metaDescription, heroHeading, introText },
    create: { serviceId: Number(serviceId), cityId: Number(cityId), metaTitle, metaDescription, heroHeading, introText },
  })
  return NextResponse.json(combo, { status: 201 })
}