import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/requireAuth'
import { NextRequest, NextResponse } from 'next/server'

type Props = { params: Promise<{ id: string }> }

export async function GET(request: NextRequest, { params }: Props) {
  const auth = await requireAuth(request)
  if (!auth.authorized) return auth.response
  const { id } = await params
  const industry = await prisma.industry.findUnique({ where: { id: Number(id) } })
  if (!industry) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(industry)
}

export async function PUT(request: NextRequest, { params }: Props) {
  const auth = await requireAuth(request)
  if (!auth.authorized) return auth.response
  const { id } = await params
  const { name, slug, description } = await request.json()
  const industry = await prisma.industry.update({ where: { id: Number(id) }, data: { name, slug, description } })
  return NextResponse.json(industry)
}

export async function DELETE(request: NextRequest, { params }: Props) {
  const auth = await requireAuth(request)
  if (!auth.authorized) return auth.response
  const { id } = await params
  await prisma.industry.delete({ where: { id: Number(id) } })
  return NextResponse.json({ success: true })
}