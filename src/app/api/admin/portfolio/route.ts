import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/requireAuth'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request)
  if (!auth.authorized) return auth.response
  const projects = await prisma.portfolio.findMany({
    include: { services: true, industries: true },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(projects)
}

export async function POST(request: NextRequest) {
  const auth = await requireAuth(request)
  if (!auth.authorized) return auth.response
  const { projectName, slug, resultSummary, clientName, projectUrl, thumbnail, serviceIds, industryIds } = await request.json()

  const project = await prisma.portfolio.create({
    data: {
      projectName,
      slug,
      resultSummary,
      clientName,
      projectUrl,
      thumbnail,
      services: serviceIds ? { connect: serviceIds.map((id: number) => ({ id })) } : undefined,
      industries: industryIds ? { connect: industryIds.map((id: number) => ({ id })) } : undefined,
    },
  })
  return NextResponse.json(project, { status: 201 })
}