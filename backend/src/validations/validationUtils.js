// archivo para validaciones que se repiten
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export async function validateUserExistence (userId) {
  const user = await prisma.user.findFirst({
    where: { id: userId }
  })
  return user !== null
}

export async function validateHabitExistence (habitId) {
  const habit = await prisma.habit.findFirst({
    where: { id: habitId }
  })
  return habit !== null
}
