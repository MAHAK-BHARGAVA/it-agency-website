// Logic: first try to match a Service+City combo. If nothing found, try Service+State using that same URL segment.  then service+industry combo. If neither matches, 404.
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'

type Props = {
  params: Promise<{ services: string; city: string }>
}

export async function generateStaticParams() {
  const serviceCities = await prisma.serviceCity.findMany({ include: { service: true, city: true } })
  const serviceStates = await prisma.serviceState.findMany({ include: { service: true, state: true } })
  const serviceIndustries = await prisma.serviceIndustry.findMany({ include: { service: true, industry: true } })

  return [
    ...serviceCities.map((sc) => ({ services: sc.service.slug, city: sc.city.slug })),
    ...serviceStates.map((ss) => ({ services: ss.service.slug, city: ss.state.slug })),
    ...serviceIndustries.map((si) => ({ services: si.service.slug, city: si.industry.slug })),
  ]
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { services, city } = await params

  const sc = await prisma.serviceCity.findFirst({ where: { service: { slug: services }, city: { slug: city } }, include: { service: true, city: true } })
  if (sc) return { title: sc.heroHeading || `${sc.service.name} in ${sc.city.name}`, description: sc.introText?.slice(0, 160) }

  const ss = await prisma.serviceState.findFirst({ where: { service: { slug: services }, state: { slug: city } }, include: { service: true, state: true } })
  if (ss) return { title: ss.heroHeading || `${ss.service.name} in ${ss.state.name}`, description: ss.introText?.slice(0, 160) }

  const si = await prisma.serviceIndustry.findFirst({ where: { service: { slug: services }, industry: { slug: city } }, include: { service: true, industry: true } })
  if (si) return { title: si.heroHeading || `${si.service.name} for ${si.industry.name}`, description: si.introText?.slice(0, 160) }

  return { title: 'Not Found' }
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