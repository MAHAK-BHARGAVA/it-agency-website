import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'

type Props = {
  params: Promise<{ services: string; city: string }>
}

export default async function ServiceCityPage({ params }: Props) {
  const { services, city } = await params

  const pageData = await prisma.serviceCity.findFirst({
    where: {
      service: { slug: services },
      city: { slug: city },
    },
    include: {
      service: true,
      city: true,
    },
  })

  if (!pageData) {
    notFound()
  }

  return (
    <main style={{ padding: '2rem' }}>
      <h1>{pageData.heroHeading}</h1>
      <p>
        Looking for <strong>{pageData.service.name}</strong> in{' '}
        <strong>{pageData.city.name}, {pageData.city.state}</strong>?
        You&apos;re in the right place.
      </p>
      <p>{pageData.introText}</p>
    </main>
  )
}