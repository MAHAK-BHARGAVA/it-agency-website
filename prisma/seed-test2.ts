import 'dotenv/config'
import { PrismaClient } from '../src/generated/prisma/client'

const prisma = new PrismaClient()

async function main() {
  const service = await prisma.service.findFirst({ where: { slug: 'seo' } })
  if (!service) return console.log('No SEO service found.')

  const state = await prisma.state.upsert({
    where: { slug: 'rajasthan' },
    update: {},
    create: { name: 'Rajasthan', slug: 'rajasthan' },
  })

  await prisma.serviceState.upsert({
    where: { serviceId_stateId: { serviceId: service.id, stateId: state.id } },
    update: {},
    create: {
      serviceId: service.id,
      stateId: state.id,
      heroHeading: 'Best SEO Company in Rajasthan',
      introText: 'We help businesses across Rajasthan grow through SEO.',
    },
  })

  const industry = await prisma.industry.upsert({
    where: { slug: 'healthcare' },
    update: {},
    create: {
      name: 'Healthcare',
      slug: 'healthcare',
      description: 'Digital solutions for hospitals and clinics.',
    },
  })

  await prisma.serviceIndustry.upsert({
    where: { serviceId_industryId: { serviceId: service.id, industryId: industry.id } },
    update: {},
    create: { serviceId: service.id, industryId: industry.id },
  })

  console.log('Seeded: Rajasthan, Healthcare, and their Service links.')
}

main().catch(console.error).finally(() => prisma.$disconnect())