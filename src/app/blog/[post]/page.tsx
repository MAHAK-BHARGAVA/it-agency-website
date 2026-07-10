import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'

type Props = {
  params: Promise<{ post: string }>
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