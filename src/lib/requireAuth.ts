// This is a reusable check we'll call at the top of every admin API route.
import { NextRequest, NextResponse } from 'next/server'
import { verifyAccessToken } from '@/lib/auth'

export async function requireAuth(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value

  if (!token) {
    return { authorized: false, response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
  }

  try {
    const payload = await verifyAccessToken(token)
    return { authorized: true, userId: payload.userId }
  } catch {
    return { authorized: false, response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
  }
}