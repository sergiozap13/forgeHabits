import { PrismaClient } from '@prisma/client'
import { habitUserSchema, tipSchema, updateSettingsSchema, updateUserHabitInfo } from '../validations/habitsValidations.js'
import { validateHabitExistence, validateUserExistence } from '../validations/validationUtils.js'
import logger from '../logger.js'
const prisma = new PrismaClient()

// GETS
async function getAvailableHabits (req, res) {
  // Aquí se podrían enseñar todos los hábitos, ahora mismo esta hecho para que se muestren solo
  // los que el usuario tiene configurados
  logger.debug('HC - getAvailableHabits')
  try {
    const userHabits = await prisma.userHabit.findMany({
      where: {
        user_id: req.user.id
      },
      select: {
        habit_id: true
      }
    })
    const userHabitIds = userHabits.map(habit => habit.habit_id)
    const availableHabits = await prisma.habit.findMany({
      where: {
        id: {
          notIn: userHabitIds
        }
      }
    })

    if (availableHabits.length === 0) {
      logger.warn('HC - The user has configured all habits')
      return res.status(404).json({ message: 'The user has configured all habits' })
    }

    res.json(availableHabits)
  } catch (error) {
    logger.error('HC - Error al recuperar todos los hábitos', error)
    res.status(500).json({ error: 'Algo ocurrió al recuperar todos los hábitos' })
  }
}

async function getHabitsUser (req, res) {
  logger.debug('HC - getHabitsUser')
  try {
    if (!await validateUserExistence(req.user.id)) {
      logger.warn('HC - BD error. The user doesnt exists')
      return res.status(400).json({ message: 'BD error. The user doesnt exists' })
    }

    const userHabits = await prisma.userHabit.findMany({
      where: {
        user_id: req.user.id
      },
      select: {
        habit_id: true,
        current_streak: true
      }
    })
    if (userHabits.length !== 0) {
      const streakMap = userHabits.reduce((map, habit) => {
        map[habit.habit_id] = habit.current_streak
        return map
      }, {})

      const userHabitIds = userHabits.map(habit => habit.habit_id)

      const availableHabits = await prisma.habit.findMany({
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
    } else {
      logger.warn('HC - The user has not habits')
      res.status(404).json({ error: 'The user has not habits' })
    }
  } catch (error) {
    logger.error('HC - Error al recuperar todos los hábitos del usuario', error)
    res.status(500).json({ error: 'Something happened retrieving all habits user' })
  }
}

async function getHabitUserInfo (req, res) {
  logger.debug('HC - getHabitUserInfo')
  try {
    if (!await validateHabitExistence(req.params.habit_id)) {
      logger.warn('HC - BD error. The habit doesnt exists')
      return res.status(400).json({ message: 'BD error. The habit doesnt exists' })
    }
    const habitUser = await prisma.userHabit.findFirst({
      where: {
        habit_id: req.params.habit_id,
        user_id: req.user.id
      }
    })
    if (habitUser !== null) res.json(habitUser)
    else {
      logger.warn('HC - The habit is not being used by the user')
      res.status(404).json({ error: 'The habit is not being used by the user' })
    }
  } catch (error) {
    logger.error('HC - Error al recuperar el hábito del usuario', error)
    res.status(500).json({
      error: 'Algo ocurrió recuperando el hábito del usuario'
    })
  }
}

async function getHabitInfo (req, res) {
  logger.debug('HC - getHabitInfo')
  try {
    if (!await validateHabitExistence(req.params.habit_id)) {
      logger.warn('HC - BD error. The habit doesnt exists')
      return res.status(400).json({ message: 'BD error. The habit doesnt exists' })
    }
    const habitInfo = await prisma.habit.findFirst({
      where: {
        id: req.params.habit_id
      }
    })
    if (habitInfo !== null) res.json(habitInfo)
    else {
      logger.warn('HC - The habit is null')
      res.status(404).json({ error: 'The habit is null' })
    }
  } catch (error) {
    logger.error('HC - Error al recuperar el hábito', error)
    res.status(500).json({
      error: 'Algo ocurrió recuperando el hábito'
    })
  }
}

async function getHabitTips (req, res) {
  logger.debug('HC - getHabitTips')
  try {
    if (!await validateHabitExistence(req.params.habit_id)) {
      logger.warn('HC - BD error. The habit doesnt exists')
      return res.status(400).json({ message: 'BD error. The habit doesnt exists' })
    }

    const habitTips = await prisma.tip.findFirst({
      where: {
        habit_id: req.params.habit_id
      }
    })
    res.json(habitTips.tips)
  } catch (error) {
    logger.error('HC - Error al recuperar los tips del habito', error)
    res.status(500).json({
      error: 'Algo ocurrió recuperando los tips del habito'
    })
  }
}

async function updateHabitTips (req, res) {
  logger.debug('HC - updateHabitTips')
  const newTip = tipSchema.parse(req.body)

  try {
    const currentTipsRecord = await prisma.tip.findFirst({
      where: {
        habit_id: req.params.habit_id
      },
      select: {
        id: true,
        tips: true
      }
    })

    if (!currentTipsRecord) {
      logger.warn('HC - Tips not found')
      return res.status(404).json({ error: 'Tips not found' })
    }

    if (currentTipsRecord.tips.includes(newTip.tip)) {
      logger.warn('HC - Tip already exists')
      return res.status(400).json({ error: 'Tip already exists' })
    }
    // actualizar el array de tips
    const updatedTips = [...currentTipsRecord.tips, newTip.tip]
    // actualizar el registro con el nuevo array
    const updatedTipEntry = await prisma.tip.update({
      where: {
        id: currentTipsRecord.id
      },
      data: {
        tips: updatedTips
      }
    })

    res.status(200).json(updatedTipEntry)
  } catch (error) {
    logger.error('HC - Error updating the tip', error)
    res.status(500).json({ error: 'An error occurred while updating the tip' })
  }
}

async function getHabitUnit (req, res) {
  logger.debug('HC - getHabitUnit')
  try {
    if (!await validateHabitExistence(req.params.habit_id)) {
      logger.warn('HC - BD error. The habit doesnt exists')
      return res.status(400).json({ message: 'BD error. The habit doesnt exists' })
    }

    const unit = await prisma.unit.findFirst({
      where: {
        habit_id: req.params.habit_id
      },
      select: {
        unit: true
      }
    })

    if (unit === null) {
      logger.warn('HC - unit not found')
      res.status(404).json({ message: 'unit not found' })
    }

    res.json(unit)
  } catch (error) {
    logger.error('HC - Error al recuperar la unidad del habito', error)
    res.status(500).json({
      error: 'Algo ocurrió recuperando la unidad del habito'
    })
  }
}

// POSTS
async function createHabitUser (req, res) {
  logger.debug('HC - createHabitUser')
  try {
    const habitId = req.params.habit_id
    const userId = req.user.id
    const parsedData = habitUserSchema.parse(req.body)

    if (!await validateUserExistence(userId)) {
      logger.warn('HC - BD error. The user doesnt exists')
      return res.status(400).json({ message: 'BD error. The user doesnt exists' })
    }

    if (!await validateHabitExistence(habitId)) {
      logger.warn('HC - BD error. The habit doesnt exists')
      return res.status(400).json({ message: 'BD error. The habit doesnt exists' })
    }

    const existingHabitUser = await prisma.userHabit.findFirst({
      where: {
        habit_id: habitId,
        user_id: userId
      }
    })
    if (existingHabitUser) {
      logger.warn('HC - The habit is already using by the user')
      return res.status(400).json({ message: 'BD error. The habit is already using by the user' })
    }

    if (existingHabitUser === null) {
      const newHabitUser = await prisma.userHabit.create({
        data: {
          ...parsedData,
          habit_id: habitId,
          user_id: userId
        }
      })

      return res.status(201).json(newHabitUser)
    }
  } catch (error) {
    if (error.name === 'ZodError') {
      logger.warn('HC - Zod Error. Validación de datos')
      return res.status(400).json({ errors: error.errors })
    }
    logger.error('HC - Error creating the habit user', error)
    res.status(500).json({ error: error.message })
  }
}

async function updateHabitUserSettings (req, res) {
  logger.debug('HC - updateHabitUserSettings')
  // validamos con zod
  // se usa un esquema diferente, ya que con en el patch se puede actualizar cualquier campo
  const parsedData = updateSettingsSchema.parse(req.body)
  // comprobamos que el usuario y el habito existan
  if (!await validateUserExistence(req.user.id)) {
    logger.warn('HC - BD error. The user doesnt exists')
    return res.status(400).json({ message: 'BD error. The user doesnt exists' })
  }

  if (!await validateHabitExistence(req.params.habit_id)) {
    logger.warn('HC - BD error. The habit doesnt exists')
    return res.status(400).json({ message: 'BD error. The habit doesnt exists' })
  }

  // comprobamos el registro a editar
  const habitUserToEdit = await prisma.userHabit.findFirst({
    where: {
      habit_id: req.params.habit_id,
      user_id: req.user.id
    }
  })

  if (habitUserToEdit !== null) {
    const updatedHabitUser = await prisma.userHabit.update({
      // el update de prisma solo espera un parametro en el where
      where: {
        id: habitUserToEdit.id
      },
      data: {
        settings: {
          ...habitUserToEdit.settings,
          ...parsedData
        }
      }
    })

    res.json(updatedHabitUser)
  } else {
    logger.warn('HC - The habit is not being used by the user')
    res.status(404).json({ error: 'The habit is not being used by the user' })
  }
}

async function updateHabitUserInfo (req, res) {
  logger.debug('HC - updateHabitUserInfo')
  try {
    const parsedData = updateUserHabitInfo.parse(req.body)
    if (parsedData.best_streak < parsedData.current_streak) {
      logger.warn('HC - Current streak must be lte best streak')
      return res.status(400).json({ message: 'Current streak must be lte best streak' })
    }

    if (!await validateUserExistence(req.user.id)) {
      logger.warn('HC - BD error. The user doesnt exists')
      return res.status(400).json({ message: 'BD error. The user doesnt exists' })
    }

    if (!await validateHabitExistence(req.params.habit_id)) {
      logger.warn('HC - BD error. The habit doesnt exists')
      return res.status(400).json({ message: 'BD error. The habit doesnt exists' })
    }

    const habitUserToEdit = await prisma.userHabit.findFirst({
      where: {
        habit_id: req.params.habit_id,
        user_id: req.user.id
      }
    })

    if (habitUserToEdit !== null) {
      const updatedHabitUser = await prisma.userHabit.update({
        // el update de prisma solo espera un parametro en el where
        where: {
          id: habitUserToEdit.id
        },
        data: {
          ...parsedData
        }
      })

      res.json(updatedHabitUser)
    } else {
      logger.warn('HC - The habit is not being used by the user')
      res.status(404).json({ error: 'The habit is not being used by the user' })
    }
  } catch (error) {
    if (error.name === 'ZodError') {
      logger.warn('HC - Zod Error. Validación de datos')
      return res.status(400).json({ errors: error.errors })
    }
    logger.error('HC - Error updating the habit user', error)
    res.status(500).json({ error: error.message })
  }
}

async function deleteHabitUser (req, res) {
  logger.debug('HC - deleteHabitUser')
  // validaciones de existencia de usuario y habtto
  if (!await validateUserExistence(req.user.id)) {
    logger.warn('HC - BD error. The user doesnt exists')
    return res.status(400).json({ error: 'BD error. The user doesnt exists' })
  }

  if (!await validateHabitExistence(req.params.habit_id)) {
    logger.warn('HC - BD error. The habit doesnt exists')
    return res.status(400).json({ error: 'BD error. The habit doesnt exists' })
  }

  try {
    const habitUserToDelete = await prisma.userHabit.findFirst({
      where: {
        user_id: req.user.id,
        habit_id: req.params.habit_id
      }
    })
    if (habitUserToDelete === null) {
      logger.warn('HC - The habit is not being used by the user.')
      res.status(400).json({ error: 'The habit is not being used by the user.' })
    } else {
      const habitUserDeleted = await prisma.userHabit.delete({
        where: {
          id: habitUserToDelete.id
        }
      })

      res.status(200).json(habitUserDeleted)
    }
  } catch (error) {
    if (error.name === 'ZodError') {
      logger.warn('HC - Zod Error. Validación de datos')
      return res.status(400).json({ errors: error.errors })
    }

    logger.error('HC - Error deleting the habit user', error)
    res.status(500).json({ error: error.message })
  }
}

export default {
  getAvailableHabits,
  getHabitsUser,
  getHabitUserInfo,
  getHabitInfo,
  getHabitTips,
  updateHabitTips,
  getHabitUnit,
  createHabitUser,
  updateHabitUserSettings,
  updateHabitUserInfo,
  deleteHabitUser
}
