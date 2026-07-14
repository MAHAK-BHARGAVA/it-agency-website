// Logic: first try to match a City. If nothing found, try State using that same URL segment. If neither matches, 404.

import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'

type Props = {
  params: Promise<{ location: string }>
}

export async function generateStaticParams() {
  const cities = await prisma.city.findMany()
  const states = await prisma.state.findMany()
  return [
    ...cities.map((c) => ({ location: c.slug })),
    ...states.map((s) => ({ location: s.slug })),
  ]
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { location } = await params

  const city = await prisma.city.findUnique({ where: { slug: location }, include: { state: true } })
  if (city) {
    return {
      title: city.metaTitle || `${city.name}${city.state ? `, ${city.state.name}` : ''} | ABC Technologies`,
      description: city.metaDescription || `Digital services for businesses in ${city.name}.`,
    }
  }

  const state = await prisma.state.findUnique({ where: { slug: location } })
  if (state) {
    return {
      title: state.metaTitle || `${state.name} | ABC Technologies`,
      description: state.metaDescription || `Digital services for businesses across ${state.name}.`,
    }
  }

  return { title: 'Not Found' }
}

export default async function LocationPage({ params }: Props) {
  const { location } = await params

  const city = await prisma.city.findUnique({
    where: { slug: location },
    include: { state: true, serviceCities: { include: { service: true } } },
  })

  if (city) {
    return (
      <main style={{ padding: '2rem' }}>
        <h1>{city.name}{city.state ? `, ${city.state.name}` : ''}</h1>
        <p>We proudly serve businesses in {city.name}.</p>
        <h2>Services available in {city.name}</h2>
        <ul>
          {city.serviceCities.map((sc) => (
            <li key={sc.id}>
              <a href={`/services/${sc.service.slug}/${city.slug}`}>
                {sc.service.name} in {city.name}
              </a>
            </li>
          ))}
        </ul>
      </main>
    )
  }

  const state = await prisma.state.findUnique({
    where: { slug: location },
    include: { cities: true, serviceStates: { include: { service: true } } },
  })

  if (state) {
    return (
      <main style={{ padding: '2rem' }}>
        <h1>{state.name}</h1>
        <p>We proudly serve businesses across {state.name}.</p>
        <h2>Cities we serve</h2>
        <ul>
          {state.cities.map((c) => (
            <li key={c.id}><a href={`/${c.slug}`}>{c.name}</a></li>
          ))}
        </ul>
        <h2>Services available across {state.name}</h2>
        <ul>
          {state.serviceStates.map((ss) => (
            <li key={ss.id}>
              <a href={`/services/${ss.service.slug}/${state.slug}`}>
                {ss.service.name} in {state.name}
              </a>
            </li>
          ))}
        </ul>
      </main>
    )
  }

  notFound()
}