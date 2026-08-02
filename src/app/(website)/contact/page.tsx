import { prisma } from '@/lib/prisma'
import { ContactForm } from '@/components/ContactForm'

export default async function ContactPage() {
  const services = await prisma.service.findMany({ orderBy: { name: 'asc' } })
  return (
    <main style={{ padding: '2rem' }}>
      <h1>Contact Us</h1>
      <ContactForm services={services} />
    </main>
  )
}