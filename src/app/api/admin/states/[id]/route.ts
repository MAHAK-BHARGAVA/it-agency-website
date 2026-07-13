import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/requireAuth'
import { NextRequest, NextResponse } from 'next/server'

type Props = { params: Promise<{ id: string }> }

export async function GET(request: NextRequest, { params }: Props) {
  const auth = await requireAuth(request)
  if (!auth.authorized) return auth.response
  const { id } = await params
  const state = await prisma.state.findUnique({ where: { id: Number(id) } })
  if (!state) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(state)
}

export async function PUT(request: NextRequest, { params }: Props) {
  const auth = await requireAuth(request)
  if (!auth.authorized) return auth.response
  const { id } = await params
  const { name, slug } = await request.json()
  const state = await prisma.state.update({ where: { id: Number(id) }, data: { name, slug } })
  return NextResponse.json(state)
}

export async function DELETE(request: NextRequest, { params }: Props) {
  const auth = await requireAuth(request)
  if (!auth.authorized) return auth.response
  const { id } = await params
  await prisma.state.delete({ where: { id: Number(id) } })
  return NextResponse.json({ success: true })
}