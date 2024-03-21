import { PrismaClient } from '@prisma/client'
import { diarySchema, updateDiarySchema } from '../validations/diaryValidations.js'
import { validateUserExistence } from '../validations/validationUtils.js'

const prisma = new PrismaClient()

async function getDiaryDay (req, res) {
  const dateDay = validateDate(req.params.day, res)

  try {
    const diaryDay = await prisma.diary.findFirst({
      where: {
        date: dateDay
      }
    })

    // si findFirst no encuentra un resultado, devuelve null
    if (diaryDay === null) {
      return res.status(404).json({ message: 'No diary entry found for the given date' })
    }

    res.json(diaryDay)
  } catch (error) {
    res.status(500).json({ error: 'Algo ocurrió al recuperar el diario' })
  }
}

// post
async function createDiaryDay (req, res) {
  const parsedData = diarySchema.parse(req.body)

  if (!await validateUserExistence(parsedData.user_id)) { return res.status(400).json({ message: 'BD error. The user doesnt exists' }) }

  const date = validateDate(req.params.day, res)

  try {
    const diaryEntry = await prisma.diary.create({
      data: {
        ...parsedData,
        date
      }
    })

    res.status(201).json(diaryEntry)
  } catch (error) {
    // clave única
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'an entry for this user already exists for this date.' })
    }

    res.status(500).json({ error: error.message })
  }
}

// patch
async function updateDiaryDay (req, res) {
  const parsedData = updateDiarySchema.parse(req.body)

  if (!await validateUserExistence(parsedData.user_id)) { return res.status(400).json({ message: 'BD error. The user doesnt exists' }) }

  const urlDate = validateDate(req.params.day, res)

  try {
    const existingEntry = await prisma.diary.findFirst({
      where: {
        user_id: parsedData.user_id,
        date: urlDate
      }
    })

    if (!existingEntry) {
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
    res.status(500).json({ error: error.message })
  }
}

async function deleteDiaryDay (req, res) {
  const urlDate = validateDate(req.params.day, res)

  try {
    const diaryToDelete = await prisma.diary.findFirst({
      where: {
        user_id: req.params.user_id,
        date: urlDate
      }
    })
    if (!diaryToDelete) { return res.status(404).json({ message: 'Diary entry not found' }) }

    const deletedEntry = await prisma.diary.delete({
      where: {
        id: diaryToDelete.id
      }
    })
    res.status(200).json(deletedEntry)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

function validateDate (dateString, res) {
  const date = new Date(dateString)
  if (isNaN(date)) {
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
