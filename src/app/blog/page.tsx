import { prisma } from '@/lib/prisma'

export default async function BlogIndexPage() {
  const posts = await prisma.blog.findMany({
    where: { publishedAt: { not: null } },
    orderBy: { publishedAt: 'desc' },
  })

  return (
    <main style={{ padding: '2rem' }}>
      <h1>Blog</h1>
      {posts.length === 0 && <p>No blog posts published yet.</p>}
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <a href={`/blog/${post.slug}`}>{post.title}</a>
            {post.excerpt && <p>{post.excerpt}</p>}
          </li>
        ))}
      </ul>
    </main>
  )
}