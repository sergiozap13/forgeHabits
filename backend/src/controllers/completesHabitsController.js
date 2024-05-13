import { PrismaClient } from '@prisma/client'
import logger from '../logger.js'
import { validateHabitExistence, validateUserExistence } from '../validations/validationUtils.js'

const prisma = new PrismaClient()

async function addCompletion (req, res) {
  logger.debug('CHC - addCompletion')

  try {
    const { habitId, date } = req.body
    const userId = req.user.id

    if (!habitId) {
      logger.warn('CHC - No habitId provided')
      return res.status(400).json({ message: 'No habit ID provided' })
    }
    // normalizo la fecha
    const completionDate = validateDate(date, res)

    // validaciones de usuario y habito
    if (!await validateUserExistence(userId)) {
      logger.warn('CHC - BD error. The user doesnt exist')
      return res.status(400).json({ message: 'BD error. The user doesnt exist' })
    }

    if (!await validateHabitExistence(habitId)) {
      logger.warn('CHC - BD error. The habit doesnt exist')
      return res.status(400).json({ message: 'BD error. The habit doesnt exist' })
    }

    // chequeamos si el usuario ya completó el habito en esa fecha
    const existingCompletion = await prisma.completes.findFirst({
      where: {
        user_id: userId,
        habit_id: habitId,
        date: completionDate
      }
    })

    if (existingCompletion) {
      logger.warn('CHC - Completion already exists for this date and habit.')
      return res.status(409).json({ message: 'Completion already exists for this date and habit.' })
    }

    const completion = await prisma.completes.create({
      data: {
        user_id: req.user.id,
        habit_id: habitId,
        date: completionDate
      }
    })

    res.status(201).json(completion)
  } catch (error) {
    logger.error('CHC - Error in addCompletion: ' + error.message)
    res.status(500).json({ error: 'An error occurred while adding the completion' })
  }
}

async function getCompletionsForDay (req, res) {
  logger.debug('CHC - getCompletionsForDay')

  // validamos la fecha
  const dateDay = validateDate(req.params.day, res)

  try {
    const userId = req.user.id

    const completions = await prisma.completes.findMany({
      where: {
        user_id: userId,
        date: dateDay
      },
      // mostramos toda la información del habito
      include: {
        habit: true
      }
    })

    res.json(completions)
  } catch (error) {
    logger.error('CHC - Error in getCompletionsForDay: ' + error.message)
    res.status(500).json({ error: 'An error occurred while fetching completions' })
  }
}

async function deleteCompletion (req, res) {
  logger.debug('CHC - deleteCompletion')
  try {
    const { habitId, date } = req.body

    const userId = req.user.id

    const completionDate = validateDate(date, res)

    await prisma.completes.deleteMany({
      where: {
        habit_id: habitId,
        user_id: userId,
        date: completionDate
      }
    })

    res.status(200).json({ message: 'Completion deleted successfully', habitId })
  } catch (error) {
    logger.error('CHC - Error in deleteCompletion: ' + error.message)
    res.status(500).json({ error: 'An error occurred while deleting the completion' })
  }
}

function validateDate (dateString, res) {
  logger.debug('DC - validateDate')
  const date = new Date(dateString)
  if (isNaN(date)) {
    logger.warn('DC - Invalid date in url.')
    res.status(400).json({ message: 'Invalid date in url.' })
    return false
  }
  return date
}

export default {
  addCompletion,
  getCompletionsForDay,
  deleteCompletion
}
