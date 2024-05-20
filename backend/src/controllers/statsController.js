import { PrismaClient } from '@prisma/client'
import logger from '../logger.js'
import { validateUserExistence } from '../validations/validationUtils.js'

const prisma = new PrismaClient()

async function getBestHabit (req, res) {
  logger.debug('SC - getBestHabit')

  try {
    const userId = req.user.id

    if (!await validateUserExistence(userId)) {
      logger.warn('SC - BD error. The user doesnt exist')
      return res.status(400).json({ message: 'BD error. The user doesnt exist' })
    }

    // obtenemos el número máximo de completados del usuario
    const maxCompletes = await prisma.completes.groupBy({
      by: ['habit_id'],
      where: {
        user_id: userId
      },
      _count: {
        habit_id: true
      },
      orderBy: {
        _count: {
          habit_id: 'desc'
        }
      },
      take: 1
    })

    if (maxCompletes.length === 0) {
      return res.status(404).json({ message: 'No habits found for the user' })
    }

    const maxCount = maxCompletes[0]._count.habit_id

    // obtenemos todos los hábitos con el número máximo de completados
    const bestHabits = await prisma.completes.groupBy({
      by: ['habit_id'],
      where: {
        user_id: userId
      },
      _count: {
        habit_id: true
      },
      having: {
        habit_id: {
          _count: {
            equals: maxCount
          }
        }
      }
    })

    const habitIds = bestHabits.map(habit => habit.habit_id)

    // obtenemos el primer hábito completado (el más antiguo - el que fue primero) entre los más completados
    const firstCompletedHabit = await prisma.completes.findFirst({
      where: {
        habit_id: {
          in: habitIds
        },
        user_id: userId
      },
      orderBy: {
        date: 'asc'
      }
    })

    if (!firstCompletedHabit) {
      return res.status(404).json({ message: 'No habits found for the user' })
    }

    const habitId = firstCompletedHabit.habit_id

    // obtenemos detalles del hábito
    const habitDetails = await prisma.habit.findUnique({
      where: {
        id: habitId
      }
    })

    if (!habitDetails) {
      return res.status(404).json({ message: 'Habit not found' })
    }

    // obtenemos la racha actual desde la tabla userHabit
    const userHabitDetails = await prisma.userHabit.findFirst({
      where: {
        user_id: userId,
        habit_id: habitId
      },
      select: {
        current_streak: true
      }
    })

    if (!userHabitDetails) {
      return res.status(404).json({ message: 'UserHabit not found' })
    }

    // construimos la respuesta final con el nombre del hábito y la racha actual
    const response = {
      habit_name: habitDetails.name,
      current_streak: userHabitDetails.current_streak,
      icon: habitDetails.material_icon
    }

    res.status(200).json(response)
  } catch (error) {
    logger.error('SC - Error in getBestHabit: ' + error.message)
    res.status(500).json({ error: 'An error occurred while getting the best habit' })
  }
}

async function getForgedHabitsSum (req, res) {
  logger.debug('SC - getForgedHabitsSum')

  try {
    const userId = req.user.id

    if (!await validateUserExistence(userId)) {
      logger.warn('SC - BD error. The user doesnt exist')
      return res.status(400).json({ message: 'BD error. The user doesnt exist' })
    }

    // sumamos todos los times_forged de los hábitos del usuario
    const forgedHabitsSum = await prisma.userHabit.aggregate({
      _sum: {
        times_forged: true
      },
      where: {
        user_id: userId
      }
    })

    const totalTimesForged = forgedHabitsSum._sum.times_forged

    res.status(200).json({ total_times_forged: totalTimesForged || 0 })
  } catch (error) {
    logger.error('SC - Error in getForgedHabitsCount: ' + error.message)
    res.status(500).json({ error: 'An error occurred while getting the forged habits count' })
  }
}

async function getUserPerformance (req, res) {
  logger.debug('SC - getUserPerformance')

  try {
    const userId = req.user.id

    if (!await validateUserExistence(userId)) {
      logger.warn('SC - BD error. The user doesnt exist')
      return res.status(400).json({ message: 'BD error. The user doesnt exist' })
    }

    // obtenemos la fecha del primer hábito completado por el usuario
    const firstCompletion = await prisma.completes.findFirst({
      where: {
        user_id: userId
      },
      orderBy: {
        date: 'asc'
      },
      select: {
        date: true
      }
    })

    if (!firstCompletion) {
      return res.status(404).json({ message: 'No habits completed found for the user' })
    }

    const startDate = new Date(firstCompletion.date)
    const today = new Date()
    const totalDays = Math.ceil((today - startDate) / (1000 * 60 * 60 * 24))

    // obtenemos el número total de hábitos configurados por el usuario
    const totalHabitsConfigured = await prisma.userHabit.count({
      where: {
        user_id: userId
      }
    })

    // calculamos el número total de hábitos esperados
    const totalExpectedCompletions = totalDays * totalHabitsConfigured

    // obtenemos el número total de hábitos completados por el usuario
    const totalCompleted = await prisma.completes.count({
      where: {
        user_id: userId
      }
    })

    // calculamos el porcentaje de hábitos completados y redondear al entero más cercano
    const completionPercentage = Math.round((totalCompleted / totalExpectedCompletions) * 100)

    const response = {
      completed: totalCompleted,
      total: totalExpectedCompletions,
      percentage: completionPercentage
    }

    res.status(200).json(response)
  } catch (error) {
    logger.error('SC - Error in getUserPerformance: ' + error.message)
    res.status(500).json({ error: 'An error occurred while getting user performance' })
  }
}

export default {
  getBestHabit,
  getForgedHabitsSum,
  getUserPerformance
}
