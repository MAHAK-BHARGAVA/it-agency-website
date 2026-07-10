// src/app/portfolio/[project]/page.tsx/portfolio/some-project-slugOne single project's full detail page
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'

type Props = {
  params: Promise<{ project: string }>
}

export default async function PortfolioDetailPage({ params }: Props) {
  const { project } = await params

  const item = await prisma.portfolio.findUnique({
    where: { slug: project },
    include: { services: true, industries: true },
  })

  if (!item) notFound()

  return (
    <main style={{ padding: '2rem' }}>
      <h1>{item.projectName}</h1>
      {item.clientName && <p>Client: {item.clientName}</p>}
      <p>{item.resultSummary}</p>
      {item.projectUrl && <p><a href={item.projectUrl} target="_blank">View Live Project</a></p>}
      <p>
        Services: {item.services.map((s) => s.name).join(', ')}
      </p>
    </main>
  )
}