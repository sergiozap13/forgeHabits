import { PrismaClient } from '@prisma/client'
import { diarySchema, updateDiarySchema } from '../validations/diaryValidations.js'
import { validateUserExistence } from '../validations/validationUtils.js'
import logger from '../logger.js'

const prisma = new PrismaClient()

async function getDiaryDay (req, res) {
  logger.debug('DC - getDiaryDay')
  const dateDay = validateDate(req.params.day, res)

  try {
    const diaryDay = await prisma.diary.findFirst({
      where: {
        date: dateDay,
        user_id: req.user.id
      }
    })

    // si findFirst no encuentra un resultado, devuelve null
    if (diaryDay === null) {
      logger.warn('DC - No diary entry found for the given date')
      return res.status(404).json({ message: 'No diary entry found for the given date' })
    }

    res.json(diaryDay)
  } catch (error) {
    logger.error('DC - Error al recuperar el diario', error)
    res.status(500).json({ error: 'Algo ocurrió al recuperar el diario' })
  }
}

// post
async function createDiaryDay (req, res) {
  logger.debug('DC - createDiaryDay')
  const parsedData = diarySchema.parse(req.body)

  if (!await validateUserExistence(req.user.id)) {
    logger.warn('DC - BD error. The user doesnt exists')
    return res.status(400).json({ message: 'BD error. The user doesnt exists' })
  }

  const date = validateDate(req.params.day, res)

  try {
    const diaryEntry = await prisma.diary.create({
      data: {
        ...parsedData,
        user_id: req.user.id,
        date
      }
    })

    res.status(201).json(diaryEntry)
  } catch (error) {
    // clave única
    if (error.code === 'P2002') {
      logger.warn('DC - an entry for this user already exists for this date.')
      return res.status(400).json({ error: 'an entry for this user already exists for this date.' })
    }
    logger.error('DC - Error creating the diary', error)
    res.status(500).json({ error: error.message })
  }
}

// patch
async function updateDiaryDay (req, res) {
  logger.debug('DC - updateDiaryDay')
  const parsedData = updateDiarySchema.parse(req.body)

  if (!await validateUserExistence(req.user.id)) {
    logger.warn('DC - BD error. The user doesnt exists')
    return res.status(400).json({ message: 'BD error. The user doesnt exists' })
  }

  const urlDate = validateDate(req.params.day, res)

  try {
    const existingEntry = await prisma.diary.findFirst({
      where: {
        user_id: req.user.id,
        date: urlDate
      }
    })

    if (!existingEntry) {
      logger.warn('DC - Diary entry not found')
      return res.status(404).json({ message: 'Diary entry not found' })
    }

    const updatedEntry = await prisma.diary.update({
      where: {
        id: existingEntry.id
      },
      data: {
        ...parsedData
      }
    })

    res.status(200).json(updatedEntry)
  } catch (error) {
    logger.error('DC - Error updating the diary', error)
    res.status(500).json({ error: error.message })
  }
}

async function deleteDiaryDay (req, res) {
  logger.debug('DC - deleteDiaryDay')
  const urlDate = validateDate(req.params.day, res)

  try {
    const diaryToDelete = await prisma.diary.findFirst({
      where: {
        user_id: req.user.id,
        date: urlDate
      }
    })
    if (!diaryToDelete) {
      logger.warn('DC - Diary entry not found')
      return res.status(404).json({ message: 'Diary entry not found' })
    }

    const deletedEntry = await prisma.diary.delete({
      where: {
        id: diaryToDelete.id
      }
    })
    res.status(200).json(deletedEntry)
  } catch (error) {
    logger.error('DC - Error deleting the diary', error)
    res.status(500).json({ error: error.message })
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
  getDiaryDay,
  createDiaryDay,
  updateDiaryDay,
  deleteDiaryDay
}
