import 'dotenv/config'
import { PrismaClient } from '../src/generated/prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const email = 'admin@abctech.com'
  const plainPassword = 'ChangeThisPassword123'

  const hashedPassword = await bcrypt.hash(plainPassword, 10)

  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      password: hashedPassword,
      name: 'Admin',
      role: 'admin',
    },
  })

  console.log('Admin user ready:', user.email)
}

main().catch(console.error).finally(() => prisma.$disconnect())