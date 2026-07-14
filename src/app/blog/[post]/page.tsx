import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'

type Props = {
  params: Promise<{ post: string }>
}

export async function generateStaticParams() {
  const posts = await prisma.blog.findMany({ where: { publishedAt: { not: null } } })
  return posts.map((p) => ({ post: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { post } = await params
  const data = await prisma.blog.findUnique({ where: { slug: post } })
  if (!data) return { title: 'Not Found' }
  return {
    title: data.metaTitle || data.title,
    description: data.metaDescription || data.excerpt || undefined,
  }
}

export default async function BlogDetailPage({ params }: Props) {
  const { post } = await params

  const blogPost = await prisma.blog.findUnique({ where: { slug: post } })

  if (!blogPost) notFound()

  return (
    <main style={{ padding: '2rem' }}>
      <h1>{blogPost.title}</h1>
      {blogPost.category && <p>Category: {blogPost.category}</p>}
      <div>{blogPost.content}</div>
    </main>
  )
}