import { prisma } from '@/lib/prisma'
import { hashToken } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const refreshToken = request.cookies.get('refreshToken')?.value

  if (refreshToken) {
    await prisma.refreshToken.updateMany({
      where: { tokenHash: hashToken(refreshToken) },
      data: { revoked: true },
    })
  }

  const response = NextResponse.json({ success: true })
  response.cookies.delete('accessToken')
  response.cookies.delete('refreshToken')

  return response
}