// Standalone Service page — /services/seo (just the service alone, no city/state). This is actually a core page type from the PRD (Section 11)

import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'

type Props = {
  params: Promise<{ services: string }>
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