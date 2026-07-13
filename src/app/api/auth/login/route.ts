// secure: true → cookie is only sent over HTTPS connections. Browser blocks it entirely on HTTP.
// secure: false → cookie can be sent over both HTTP and HTTPS. No restriction on connection type.


// Running locally right now (npm run dev):
//   NODE_ENV = "development"
//   "development" === "production"  →  false
//   secure: false  →  cookie works over plain HTTP ✅

// Running live on Vercel later:
//   NODE_ENV = "production"  
//   "production" === "production"  →  true
//   secure: true  →  cookie only works over HTTPS ✅ (Vercel gives you HTTPS automatically)
import { prisma } from '@/lib/prisma'
import { signAccessToken, generateRefreshToken, hashToken } from '@/lib/auth'
import bcrypt from 'bcryptjs'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const { email, password } = await request.json()

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }

  const valid = await bcrypt.compare(password, user.password)
  if (!valid) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }

  const accessToken = await signAccessToken(user.id)
  const refreshToken = generateRefreshToken()

  await prisma.refreshToken.create({
    data: {
      tokenHash: hashToken(refreshToken),
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  })

  const response = NextResponse.json({ success: true })

  response.cookies.set('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 15 * 60,
    path: '/',
  })

  response.cookies.set('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60,
    path: '/',
  })

  return response
}