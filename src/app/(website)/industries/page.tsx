// Industries Index — http://localhost:3000/industries
// Should show:

// Heading "Industries We Serve"
// like healthcare, finance, manufacturing

import { prisma } from '@/lib/prisma'

export default async function IndustriesIndexPage() {
  const industries = await prisma.industry.findMany({
    orderBy: { name: 'asc' },
  })

  return (
    <main style={{ padding: '2rem' }}>
      <h1>Industries We Serve</h1>
      <ul>
        {industries.map((industry) => (
          <li key={industry.id}>
            <a href={`/industries/${industry.slug}`}>{industry.name}</a>
            <p>{industry.description}</p>
          </li>
        ))}
      </ul>
    </main>
  )
}