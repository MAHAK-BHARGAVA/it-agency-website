// 7. Services Index — http://localhost:3000/services
// Should show:

// Heading "Our Services"
// like seo,web-development etc.

import { prisma } from '@/lib/prisma'

export default async function ServicesIndexPage() {
  const services = await prisma.service.findMany({
    orderBy: { name: 'asc' },
  })

  return (
    <main style={{ padding: '2rem' }}>
      <h1>Our Services</h1>
      <ul>
        {services.map((service) => (
          <li key={service.id}>
            <a href={`/services/${service.slug}`}>{service.name}</a>
            <p>{service.description}</p>
          </li>
        ))}
      </ul>
    </main>
  )
}