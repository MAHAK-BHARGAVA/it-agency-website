// What each function does

// signAccessToken — creates the 15-min JWT
// verifyAccessToken — checks a JWT is valid, returns its data
// generateRefreshToken — random string for the refresh token
// hashToken — hashes it before saving to DB
import { SignJWT, jwtVerify } from 'jose'
import { randomBytes, createHash } from 'crypto'

const secret = new TextEncoder().encode(process.env.JWT_SECRET)

export async function signAccessToken(userId: number) {
  return await new SignJWT({ userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('15m')
    .sign(secret)
}

export async function verifyAccessToken(token: string) {
  const { payload } = await jwtVerify(token, secret)
  return payload as { userId: number }
}

export function generateRefreshToken() {
  return randomBytes(40).toString('hex')
}

export function hashToken(token: string) {
  return createHash('sha256').update(token).digest('hex')
}