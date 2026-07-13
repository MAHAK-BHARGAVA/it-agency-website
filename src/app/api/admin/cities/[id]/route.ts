import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/requireAuth'
import { NextRequest, NextResponse } from 'next/server'

type Props = { params: Promise<{ id: string }> }

export async function GET(request: NextRequest, { params }: Props) {
  const auth = await requireAuth(request)
  if (!auth.authorized) return auth.response
  const { id } = await params
  const city = await prisma.city.findUnique({ where: { id: Number(id) } })
  if (!city) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(city)
}

export async function PUT(request: NextRequest, { params }: Props) {
  const auth = await requireAuth(request)
  if (!auth.authorized) return auth.response
  const { id } = await params
  const { name, slug, stateId } = await request.json()
  const city = await prisma.city.update({
    where: { id: Number(id) },
    data: { name, slug, stateId: stateId ? Number(stateId) : null },
  })
  return NextResponse.json(city)
}

export async function DELETE(request: NextRequest, { params }: Props) {
  const auth = await requireAuth(request)
  if (!auth.authorized) return auth.response
  const { id } = await params
  await prisma.city.delete({ where: { id: Number(id) } })
  return NextResponse.json({ success: true })
}