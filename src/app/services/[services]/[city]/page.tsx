// Logic: first try to match a Service+City combo. If nothing found, try Service+State using that same URL segment.  then service+industry combo. If neither matches, 404.
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'

type Props = {
  params: Promise<{ services: string; city: string }>
}

export default async function ServiceLocationPage({ params }: Props) {
  const { services, city } = await params

  const serviceCity = await prisma.serviceCity.findFirst({
    where: { service: { slug: services }, city: { slug: city } },
    include: { service: true, city: { include: { state: true } } },
  })

  if (serviceCity) {
    return (
      <main style={{ padding: '2rem' }}>
        <h1>{serviceCity.heroHeading}</h1>
        <p>
          Looking for <strong>{serviceCity.service.name}</strong> in{' '}
          <strong>
            {serviceCity.city.name}
            {serviceCity.city.state ? `, ${serviceCity.city.state.name}` : ''}
          </strong>?
        </p>
        <p>{serviceCity.introText}</p>
      </main>
    )
  }

  const serviceState = await prisma.serviceState.findFirst({
    where: { service: { slug: services }, state: { slug: city } },
    include: { service: true, state: true },
  })

  if (serviceState) {
    return (
      <main style={{ padding: '2rem' }}>
        <h1>{serviceState.heroHeading}</h1>
        <p>
          Looking for <strong>{serviceState.service.name}</strong> across{' '}
          <strong>{serviceState.state.name}</strong>?
        </p>
        <p>{serviceState.introText}</p>
      </main>
    )
  }

  const serviceIndustry = await prisma.serviceIndustry.findFirst({
    where: { service: { slug: services }, industry: { slug: city } },
    include: { service: true, industry: true },
  })

  if (serviceIndustry) {
    return (
      <main style={{ padding: '2rem' }}>
        <h1>{serviceIndustry.heroHeading ?? `${serviceIndustry.service.name} for ${serviceIndustry.industry.name}`}</h1>
        <p>
          <strong>{serviceIndustry.service.name}</strong> solutions built for the{' '}
          <strong>{serviceIndustry.industry.name}</strong> industry.
        </p>
        <p>{serviceIndustry.introText}</p>
      </main>
    )
  }

  notFound()
}