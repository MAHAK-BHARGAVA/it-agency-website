// src/app/portfolio/page.tsx/portfolioThe index/list — every project, as a grid or list of links
import { prisma } from '@/lib/prisma'

export default async function PortfolioPage() {
  const projects = await prisma.portfolio.findMany({
    orderBy: { createdAt: 'desc' },
    include: { services: true, industries: true },
  })

  return (
    <main style={{ padding: '2rem' }}>
      <h1>Our Portfolio</h1>
      {projects.length === 0 && <p>No projects added yet.</p>}
      <ul>
        {projects.map((p) => (
          <li key={p.id}>
            <a href={`/portfolio/${p.slug}`}>{p.projectName}</a>
            <p>{p.resultSummary}</p>
            <p>
              Tags: {p.services.map((s) => s.name).join(', ')}
              {p.industries.length > 0 && ` | ${p.industries.map((i) => i.name).join(', ')}`}
            </p>
          </li>
        ))}
      </ul>
    </main>
  )
}