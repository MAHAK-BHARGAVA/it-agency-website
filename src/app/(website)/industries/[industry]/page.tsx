// What /industries/[industry]/page.tsx handles
// This is for URLs like:
// /industries/healthcare
// /industries/education
// /industries/real-estate

import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'

type Props = {
  params: Promise<{ industry: string }>
}

export async function generateStaticParams() {
  const industries = await prisma.industry.findMany()
  return industries.map((i) => ({ industry: i.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { industry } = await params
  const data = await prisma.industry.findUnique({ where: { slug: industry } })
  if (!data) return { title: 'Not Found' }
  return {
    title: data.metaTitle || `${data.name} Solutions | ABC Technologies`,
    description: data.metaDescription || data.description.slice(0, 160),
  }
}

export default async function IndustryPage({ params }: Props) {
  const { industry } = await params

  const industryData = await prisma.industry.findUnique({
    where: { slug: industry },
    include: { serviceIndustries: { include: { service: true } },testimonials:true, },
  })

  if (!industryData) notFound()
  
    let displayTestimonials = industryData.testimonials

    if (displayTestimonials.length === 0) {
      displayTestimonials = await prisma.testimonial.findMany({
        where: {
          services: { none: {} },
          cities: { none: {} },
          industries: { none: {} },
        },
        take: 3,
      })
    }

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
      {displayTestimonials.length > 0 && (
  <>
    <h2>Testimonials</h2>
    {displayTestimonials.map((t) => (
      <p key={t.id}>&ldquo;{t.quote}&rdquo; — {t.clientName}</p>
    ))}
  </>
)}
    </main>
  )
}