import { PrismaClient } from '@prisma/client'
import 'dotenv/config'
const prisma = new PrismaClient()

async function main () {
  const allHabits = await prisma.habits.findMany()
  const allUsers = await prisma.users.findMany()
  console.log(allHabits)
  console.log(allUsers)
}

main().catch(e => {
  throw e
})
  .finally(async () => {
    await prisma.$disconnect()
  })
