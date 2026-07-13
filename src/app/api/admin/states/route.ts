import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/requireAuth'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request)
  if (!auth.authorized) return auth.response
  const states = await prisma.state.findMany({ orderBy: { name: 'asc' } })
  return NextResponse.json(states)
}

export async function POST(request: NextRequest) {
  const auth = await requireAuth(request)
  if (!auth.authorized) return auth.response
  const { name, slug } = await request.json()
  const state = await prisma.state.create({ data: { name, slug } })
  return NextResponse.json(state, { status: 201 })
}