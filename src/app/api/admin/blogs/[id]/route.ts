import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/requireAuth'
import { NextRequest, NextResponse } from 'next/server'

type Props = { params: Promise<{ id: string }> }

export async function GET(request: NextRequest, { params }: Props) {
  const auth = await requireAuth(request)
  if (!auth.authorized) return auth.response
  const { id } = await params
  const blog = await prisma.blog.findUnique({ where: { id: Number(id) } })
  if (!blog) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(blog)
}

export async function PUT(request: NextRequest, { params }: Props) {
  const auth = await requireAuth(request)
  if (!auth.authorized) return auth.response
  const { id } = await params
  const { title, slug, content, excerpt, category, publishedAt } = await request.json()
  const blog = await prisma.blog.update({
    where: { id: Number(id) },
    data: { title, slug, content, excerpt, category, publishedAt: publishedAt ? new Date(publishedAt) : null },
  })
  return NextResponse.json(blog)
}

export async function DELETE(request: NextRequest, { params }: Props) {
  const auth = await requireAuth(request)
  if (!auth.authorized) return auth.response
  const { id } = await params
  await prisma.blog.delete({ where: { id: Number(id) } })
  return NextResponse.json({ success: true })
}