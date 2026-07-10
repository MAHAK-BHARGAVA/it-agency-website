import { prisma } from '@/lib/prisma'

export default async function Home() {
  const services = await prisma.service.findMany()

  const seoInJaipur = await prisma.serviceCity.findFirst({
    where: {
      service: { slug: 'seo' },
      city: { slug: 'jaipur' },
    },
    include: {
      service: true,
      city: true,
    },
  })

  return (
    <main style={{ padding: '2rem' }}>
      <h1>ABC Technologies</h1>

      <h2>Our Services</h2>
      <ul>
        {services.map((service) => (
          <li key={service.id}>
            <strong>{service.name}</strong> — {service.description}
          </li>
        ))}
      </ul>

      <h2>Test: Service + City Page Data</h2>
      {seoInJaipur ? (
        <div>
          <p><strong>Hero Heading:</strong> {seoInJaipur.heroHeading}</p>
          <p><strong>Service:</strong> {seoInJaipur.service.name}</p>
          <p><strong>City:</strong> {seoInJaipur.city.name}, {seoInJaipur.city.state}</p>
        </div>
      ) : (
        <p>No Service+City combination found.</p>
      )}
    </main>
  )
}