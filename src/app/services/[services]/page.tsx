// Standalone Service page — /services/seo (just the service alone, no city/state). This is actually a core page type from the PRD (Section 11)

// generateMetadata → handles "optimizing page titles, headings, meta descriptions" for every dynamic page automatically
// generateStaticParams → handles "making your website load quickly" by pre-building pages instead of generating them on-demand every time

import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'

type Props = {
  params: Promise<{ services: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { services } = await params

  const service = await prisma.service.findUnique({ where: { slug: services } })

  if (!service) {
    return { title: 'Service Not Found' }
  }

  return {
    title: service.metaTitle || `${service.name} Services | ABC Technologies`,
    description: service.metaDescription || service.description.slice(0, 160),
  }
}

export async function generateStaticParams() {
  const services = await prisma.service.findMany()
  return services.map((service) => ({ services: service.slug }))
}

export default async function ServicePage({ params }: Props) {
  const { services } = await params

  const service = await prisma.service.findUnique({
    where: { slug: services },
    include: {
      serviceCities: { include: { city: true }, take: 5 },
      testimonials: true,
      faqs: true,
    },
  })

  if (!service) {
    notFound()
  }

  return (
    <main style={{ padding: '2rem' }}>
      <h1>{service.name}</h1>
      <p>{service.description}</p>

      {service.serviceCities.length > 0 && (
        <>
          <h2>Available in these cities</h2>
          <ul>
            {service.serviceCities.map((sc) => (
              <li key={sc.id}>
                <a href={`/services/${service.slug}/${sc.city.slug}`}>
                  {service.name} in {sc.city.name}
                </a>
              </li>
            ))}
          </ul>
        </>
      )}

      {service.faqs.length > 0 && (
        <>
          <h2>FAQs</h2>
          {service.faqs.map((faq) => (
            <div key={faq.id}>
              <p><strong>{faq.question}</strong></p>
              <p>{faq.answer}</p>
            </div>
          ))}
        </>
      )}

      {service.testimonials.length > 0 && (
        <>
          <h2>Testimonials</h2>
          {service.testimonials.map((t) => (
            <p key={t.id}>&ldquo;{t.quote}&rdquo; — {t.clientName}</p>
          ))}
        </>
      )}
    </main>
  )
}