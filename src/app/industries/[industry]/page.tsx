// What /industries/[industry]/page.tsx handles
// This is for URLs like:
// /industries/healthcare
// /industries/education
// /industries/real-estate

import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'

type Props = {
  params: Promise<{ industry: string }>
}

export default async function IndustryPage({ params }: Props) {
  const { industry } = await params

  const industryData = await prisma.industry.findUnique({
    where: { slug: industry },
    include: { serviceIndustries: { include: { service: true } } },
  })

  if (!industryData) notFound()

  return (
    <main style={{ padding: '2rem' }}>
      <h1>{industryData.name}</h1>
      <p>{industryData.description}</p>
      <h2>Relevant Services</h2>
      <ul>
        {industryData.serviceIndustries.map((si) => (
          <li key={si.id}>{si.service.name}</li>
        ))}
      </ul>
    </main>
  )
}