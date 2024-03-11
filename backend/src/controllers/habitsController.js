import { PrismaClient } from '@prisma/client'
import { habitUserSchema, updateSettingsSchema } from '../validations/habitsValidations.js'
import { validateHabitExistence, validateUserExistence } from '../validations/validationUtils.js'
const prisma = new PrismaClient()

// GETS
async function getAvailableHabits (req, res) {
  // Aquí se podrían enseñar todos los hábitos, ahora mismo esta hecho para que se muestren solo
  // los que el usuario tiene configurados
  try {
    const userHabits = await prisma.userHabits.findMany({
      where: {
        user_id: '65ea12ea835c9e09be0a4c16' // TODO: recoger el id del usuario de la session
      },
      select: {
        habit_id: true
      }
    })
    console.log(userHabits)
    const userHabitIds = userHabits.map(habit => habit.habit_id)
    console.log(userHabitIds)
    const availableHabits = await prisma.habits.findMany({
      where: {
        id: {
          notIn: userHabitIds
        }
      }
    })

    res.json(availableHabits)
  } catch (error) {
    res.status(500).json({ error: 'Algo ocurrió al recuperar todos los hábitos' })
  }
}

async function getHabitsUser (req, res) {
  try {
    const userHabits = await prisma.userHabits.findMany({
      where: {
        user_id: req.params.user_id // TODO: recoger el id del usuario de la session
      },
      select: {
        habit_id: true,
        current_streak: true
      }
    })

    const streakMap = userHabits.reduce((map, habit) => {
      map[habit.habit_id] = habit.current_streak
      return map
    }, {})

    const userHabitIds = userHabits.map(habit => habit.habit_id)

    const availableHabits = await prisma.habits.findMany({
      where: {
        id: {
          in: userHabitIds
        }
      }
    })

    const habitsWithStreaks = availableHabits.map(habit => {
      return {
        ...habit,
        current_streak: streakMap[habit.id] || 0
      }
    })

    res.json(habitsWithStreaks)
  } catch (error) {
    res.status(500).json({ error: 'Algo ocurrió al recuperar todos los hábitos' })
  }
}

async function getHabitUserInfo (req, res) {
  try {
    const habitUser = await prisma.userHabits.findMany({
      where: {
        habit_id: req.params.habit_id,
        user_id: req.params.user_id
      }
    })

    res.json(habitUser)
  } catch (error) {
    res.status(500).json({
      error: 'Algo ocurrió recuperando el hábito del usuario'
    })
  }
}

async function getHabitTips (req, res) {
  try {
    const habitTips = await prisma.tips.findMany({
      where: {
        habit_id: req.params.habit_id
      }
    })
    res.json(habitTips)
  } catch (error) {
    res.status(500).json({
      error: 'Algo ocurrió recuperando los tips del habito'
    })
  }
}

async function getHabitUnit (req, res) {
  try {
    const unit = await prisma.units.findMany({
      where: {
        habit_id: req.params.habit_id
      },
      select: {
        unit: true
      }
    })

    res.json(unit)
  } catch (error) {
    res.status(500).json({
      error: 'Algo ocurrió recuperando la unidad del habito'
    })
  }
}

// POSTS
async function createHabitUser (req, res) {
  try {
    const parsedData = habitUserSchema.parse(req.body)

    if (!await validateUserExistence(parsedData.user_id)) { return res.status(400).json({ message: 'BD error. The user doesnt exists' }) }

    if (!await validateHabitExistence(parsedData.habit_id)) { return res.status(400).json({ message: 'BD error. The habit doesnt exists' }) }

    const existingHabitUser = await prisma.userHabits.findFirst({
      where: {
        habit_id: parsedData.habit_id,
        user_id: parsedData.user_id
      }
    })

    if (existingHabitUser) { return res.status(400).json({ message: 'BD error. The habit is already using by the user' }) }

    res.json(parsedData) // TODO: añadirlo a BD
  } catch (error) {
    if (error.name === 'ZodError') {
      console.log('Zod Error. Validación de datos')
      return res.status(400).json({ errors: error.errors })
    }

    res.status(500).json({ error: error.message })
  }
}

async function updateHabitUserSettings (req, res) {
  // validamos con zod
  // se usa un esquema diferente, ya que con en el patch se puede actualizar cualquier campo
  const parsedData = updateSettingsSchema.parse(req.body)
  // comprobamos que el usuario y el habito existan
  if (!await validateUserExistence(req.params.user_id)) { return res.status(400).json({ message: 'BD error. The user doesnt exists' }) }

  if (!await validateHabitExistence(req.params.habit_id)) { return res.status(400).json({ message: 'BD error. The habit doesnt exists' }) }

  // comprobamos el registro a editar
  const habitUserToEdit = await prisma.userHabits.findFirst({
    where: {
      habit_id: req.params.habit_id,
      user_id: req.params.user_id
    }
  })

  // TODO: escribir en BD

  console.log(habitUserToEdit)

  console.log(parsedData)
}

async function deleteHabitUser (req, res) {
  // validaciones de existencia de usuario y habtto
  if (!await validateUserExistence(req.params.user_id)) { return res.status(400).json({ message: 'BD error. The user doesnt exists' }) }

  if (!await validateHabitExistence(req.params.habit_id)) { return res.status(400).json({ message: 'BD error. The habit doesnt exists' }) }

  const habitUserToDelete = await prisma.userHabits.findFirst({
    where: {
      user_id: req.params.user_id,
      habit_id: req.params.habit_id
    }
  })

  // TODO: eliminar registro de BD

  console.log(habitUserToDelete)
}

export default {
  getAvailableHabits,
  getHabitsUser,
  getHabitUserInfo,
  getHabitTips,
  getHabitUnit,
  createHabitUser,
  updateHabitUserSettings,
  deleteHabitUser
}
