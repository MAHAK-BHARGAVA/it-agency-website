import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/requireAuth'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request)
  if (!auth.authorized) return auth.response
  const cities = await prisma.city.findMany({ orderBy: { name: 'asc' } })
  return NextResponse.json(cities)
}

export async function POST(request: NextRequest) {
  const auth = await requireAuth(request)
  if (!auth.authorized) return auth.response
  const { name, slug, stateId } = await request.json()
  const city = await prisma.city.create({ data: { name, slug, stateId: stateId ? Number(stateId) : null } })
  return NextResponse.json(city, { status: 201 })
}