import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/requireAuth'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request)
  if (!auth.authorized) return auth.response
  const blogs = await prisma.blog.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json(blogs)
}

export async function POST(request: NextRequest) {
  const auth = await requireAuth(request)
  if (!auth.authorized) return auth.response
  const { title, slug, content, excerpt, category } = await request.json()
  const blog = await prisma.blog.create({ data: { title, slug, content, excerpt, category } })
  return NextResponse.json(blog, { status: 201 })
}