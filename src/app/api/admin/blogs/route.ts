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
  const { title, slug, content, excerpt, category,
  featuredImage,
  publishedAt,
  metaTitle,
  metaDescription,
  canonicalUrl,
  ogImage, } = await request.json()
  if (!title || !slug || !content) {
  return NextResponse.json(
    { error: "Title, slug and content are required" },
    { status: 400 },
  );
}
const blog = await prisma.blog.create({
  data: {
    title,
    slug,
    content,
    excerpt: excerpt || null,
    category: category || null,
    featuredImage: featuredImage || null,

    publishedAt: publishedAt
      ? new Date(publishedAt)
      : null,

    metaTitle: metaTitle || null,
    metaDescription: metaDescription || null,
    canonicalUrl: canonicalUrl || null,
    ogImage: ogImage || null,
  },
});
  return NextResponse.json(blog, { status: 201 })
}