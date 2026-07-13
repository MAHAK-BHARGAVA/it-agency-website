import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/requireAuth'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request)
  if (!auth.authorized) return auth.response
  const industries = await prisma.industry.findMany({ orderBy: { name: 'asc' } })
  return NextResponse.json(industries)
}

export async function POST(request: NextRequest) {
  const auth = await requireAuth(request)
  if (!auth.authorized) return auth.response
  const { name, slug, description } = await request.json()
  const industry = await prisma.industry.create({ data: { name, slug, description } })
  return NextResponse.json(industry, { status: 201 })
}