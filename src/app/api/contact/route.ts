import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { name, email, phone, message, city, serviceId } = body

  if (!name || !email || !phone || !message) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const lead = await prisma.lead.create({
    data: {
      name,
      email,
      phone,
      message,
      city: city || null,
      serviceId: serviceId ? Number(serviceId) : null,
    },
  })

  return NextResponse.json({ success: true, lead })
}