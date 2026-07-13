import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/requireAuth'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request)
  if (!auth.authorized) return auth.response

  const services = await prisma.service.findMany({ orderBy: { name: 'asc' } })
  return NextResponse.json(services)
}

export async function POST(request: NextRequest) {
  const auth = await requireAuth(request)
  if (!auth.authorized) return auth.response

  const { name, slug, description } = await request.json()

  if (!name || !slug || !description) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const service = await prisma.service.create({
    data: { name, slug, description },
  })

  return NextResponse.json(service, { status: 201 })
}