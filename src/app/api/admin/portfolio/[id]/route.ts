import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/requireAuth'
import { NextRequest, NextResponse } from 'next/server'

type Props = { params: Promise<{ id: string }> }

export async function GET(request: NextRequest, { params }: Props) {
  const auth = await requireAuth(request)
  if (!auth.authorized) return auth.response
  const { id } = await params
  const project = await prisma.portfolio.findUnique({
    where: { id: Number(id) },
    include: { services: true, industries: true },
  })
  if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(project)
}

export async function PUT(request: NextRequest, { params }: Props) {
  const auth = await requireAuth(request)
  if (!auth.authorized) return auth.response
  const { id } = await params
  const { projectName, slug, resultSummary, clientName, projectUrl, thumbnail, serviceIds } = await request.json()

  const project = await prisma.portfolio.update({
    where: { id: Number(id) },
    data: {
      projectName,
      slug,
      resultSummary,
      clientName,
      projectUrl,
      thumbnail,
      services: serviceIds ? { set: serviceIds.map((sid: number) => ({ id: sid })) } : undefined,
    },
  })
  return NextResponse.json(project)
}

export async function DELETE(request: NextRequest, { params }: Props) {
  const auth = await requireAuth(request)
  if (!auth.authorized) return auth.response
  const { id } = await params
  await prisma.portfolio.delete({ where: { id: Number(id) } })
  return NextResponse.json({ success: true })
}