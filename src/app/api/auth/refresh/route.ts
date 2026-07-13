import { prisma } from '@/lib/prisma'
import { signAccessToken, generateRefreshToken, hashToken } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const refreshToken = request.cookies.get('refreshToken')?.value

  if (!refreshToken) {
    return NextResponse.json({ error: 'No refresh token' }, { status: 401 })
  }

  const tokenHash = hashToken(refreshToken)

  const stored = await prisma.refreshToken.findUnique({
    where: { tokenHash },
  })

  if (!stored || stored.revoked || stored.expiresAt < new Date()) {
    return NextResponse.json({ error: 'Invalid refresh token' }, { status: 401 })
  }

  // Rotate: revoke old, issue new
  await prisma.refreshToken.update({
    where: { id: stored.id },
    data: { revoked: true },
  })

  const newAccessToken = await signAccessToken(stored.userId)
  const newRefreshToken = generateRefreshToken()

  await prisma.refreshToken.create({
    data: {
      tokenHash: hashToken(newRefreshToken),
      userId: stored.userId,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  })

  const response = NextResponse.json({ success: true })

  response.cookies.set('accessToken', newAccessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 15 * 60,
    path: '/',
  })

  response.cookies.set('refreshToken', newRefreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60,
    path: '/',
  })

  return response
}