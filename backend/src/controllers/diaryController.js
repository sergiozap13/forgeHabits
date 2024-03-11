import { PrismaClient } from '@prisma/client'
import { diarySchema, updateDiarySchema } from '../validations/diaryValidations.js'
import { validateUserExistence } from '../validations/validationUtils.js'

const prisma = new PrismaClient()

async function getDiaryDay (req, res) {
  const dateString = req.params.day
  const dateDay = new Date(dateString)
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

  const date = new Date(req.params.day)
  // validamos la fecha
  if (isNaN(date)) {
    return res.status(400).json({ message: 'Invalid date in url.' })
  }

  const data = {
    ...parsedData,
    date
  }
  // TODO: añadir a base de datos
  console.log(data)
}

// patch
async function updateDiaryDay (req, res) {
  const parsedData = updateDiarySchema.parse(req.body)

  const urlDate = new Date(req.params.day)

  if (!await validateUserExistence(parsedData.user_id)) { return res.status(400).json({ message: 'BD error. The user doesnt exists' }) }

  if (isNaN(urlDate)) {
    return res.status(400).json({ message: 'Invalid date in url.' })
  }
  const diaryToUpdate = await prisma.diary.findFirst({
    where: {
      user_id: parsedData.user_id,
      date: urlDate
    }
  })

  // TODO: actualizar el diario en bd
  console.log(diaryToUpdate)

  res.json(parsedData)
}

async function deleteDiaryDay (req, res) {
  const urlDate = new Date(req.params.day)
  if (isNaN(urlDate)) {
    return res.status(400).json({ message: 'Invalid date in url.' })
  }

  const diaryToDelete = await prisma.diary.findFirst({
    where: {
      user_id: req.params.user_id,
      date: urlDate
    }
  })

  if (diaryToDelete === null) { res.status(404).json({ message: 'Diary not found' }) }

  // TODO: borrar el hábito de la bd
  console.log(diaryToDelete)
}

export default {
  getDiaryDay,
  createDiaryDay,
  updateDiaryDay,
  deleteDiaryDay
}
