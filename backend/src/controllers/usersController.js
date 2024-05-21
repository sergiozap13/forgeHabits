import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { userSchema, updateUserSchema } from '../validations/usersValidations.js'
import logger from '../logger.js'
const prisma = new PrismaClient()

async function getAllUsers (req, res) {
  logger.debug('UC - getAllUsers')
  try {
    const allUsers = await prisma.user.findMany()

    res.status(200).json(allUsers)
  } catch (error) {
    logger.error('UC - Error getting the users', error)
    res.status(500).json({ error: 'Algo ocurrió recuperando los usuarios' })
  }
}

async function getUserInfo (req, res) {
  logger.debug('UC - getUserInfo')
  const userId = req.user.id
  try {
    const user = await prisma.user.findFirst({
      where: {
        id: userId
      }
    })

    if (user === null) {
      logger.warn('UC - User not found')
      return res.status(404).json({ messsage: 'user not found' })
    }

    res.status(200).json(user)
  } catch (error) {
    logger.error('UC - Error getting the user', error)
    res.status(500).json({ errors: error })
  }
}

async function getUserByUsername (req, res) {
  logger.debug('UC - getUserByUsername')
  const usernameParam = req.params.username
  try {
    const user = await prisma.user.findFirst({
      where: {
        username: usernameParam
      }
    })

    if (user === null) {
      logger.warn('UC - User not found')
      return res.status(404).json({ messsage: 'user not found' })
    }

    res.status(200).json(user)
  } catch (error) {
    logger.error('UC - Error getting the user', error)
    res.status(500).json({ errors: error })
  }
}

async function createUser (req, res) {
  logger.debug('UC - createUser')
  const parsedData = userSchema.parse(req.body)

  try {
    const existingEmail = await prisma.user.findUnique({
      where: {
        email: parsedData.email
      }
    })

    if (existingEmail) {
      logger.warn('UC - Email already exists')
      return res.status(400).json({ message: 'Email already exists' })
    }

    const existingUsername = await prisma.user.findUnique({
      where: {
        username: parsedData.username
      }
    })

    if (existingUsername) {
      logger.warn('UC - Username already exists')
      return res.status(400).json({ message: 'Username already exists' })
    }

    const hashedPassword = await hashPassword(parsedData.password)

    const createdUser = await prisma.user.create({
      data: {
        ...parsedData,
        password: hashedPassword
      }
    })

    const payload = { id: createdUser.id }
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' })

    const response = {
      id: createdUser.id,
      username: createdUser.username,
      token
    }

    res.status(201).json(response)
  } catch (error) {
    logger.error('UC - Error creating the user', error)
    res.status(500).json({ errors: error })
  }
}

async function updateUserById (req, res) {
  logger.debug('UC - updateUserById')
  const userId = req.params.id
  const updateData = updateUserSchema.parse(req.body)

  if (Object.keys(updateData).length === 0) {
    logger.warn('UC - No update data provided')
    return res.status(400).json({ message: 'No update data provided' })
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!existingUser) {
      logger.warn('UC - User not found')
      return res.status(404).json({ message: 'User not found' })
    }

    if (updateData.password) {
      updateData.password = await hashPassword(updateData.password)
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData
    })

    res.status(200).json({ message: 'User updated successfully', updatedUser })
  } catch (error) {
    logger.error('UC - Error updating the user', error)
    res.status(500).json({ error: error.message })
  }
}

async function updateUserByUsername (req, res) {
  logger.debug('UC - updateUserByUsername')
  const username = req.params.username
  const updateData = updateUserSchema.parse(req.body)

  if (Object.keys(updateData).length === 0) {
    logger.warn('UC - No update data provided')
    return res.status(400).json({ message: 'No update data provided' })
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { username }
    })

    if (!existingUser) {
      logger.warn('UC - User not found')
      return res.status(404).json({ message: 'User not found' })
    }

    if (updateData.password) {
      updateData.password = await hashPassword(updateData.password)
    }

    const updatedUser = await prisma.user.update({
      where: { username },
      data: updateData
    })

    res.status(200).json({ message: 'User updated successfully', updatedUser })
  } catch (error) {
    logger.error('UC - Error updating the user', error)
    res.status(500).json({ error: error.message })
  }
}

async function deleteUserById (req, res) {
  logger.debug('UC - deleteUserById')
  const userId = req.params.id

  try {
    const existingUser = await prisma.user.findUnique({ where: { id: userId } })

    if (!existingUser) {
      logger.warn('UC - User not found')
      return res.status(404).json({ message: 'User not found' })
    }

    await prisma.diary.deleteMany({ where: { user_id: userId } })
    await prisma.completes.deleteMany({ where: { user_id: userId } })
    await prisma.userHabit.deleteMany({ where: { user_id: userId } })

    await prisma.user.delete({ where: { id: userId } })
    res.status(200).json({ message: 'User successfully deleted' })
  } catch (error) {
    logger.error('UC - Error deleting the user', error)
    res.status(500).json({ error: 'An error occurred while deleting the user' })
  }
}

// TODO: Probar esta función
async function deleteUserByUsername (req, res) {
  logger.debug('UC - deleteUserByUsername')
  const username = req.params.username

  try {
    const existingUser = await prisma.user.findUnique({ where: { username } })

    if (!existingUser) {
      logger.warn('UC - User not found')
      return res.status(404).json({ message: 'User not found' })
    }

    await prisma.diary.deleteMany({ where: { username } })
    await prisma.completes.deleteMany({ where: { username } })
    await prisma.userHabit.deleteMany({ where: { username } })

    await prisma.user.delete({ where: { username } })
    res.status(200).json({ message: 'User successfully deleted' })
  } catch (error) {
    logger.error('UC - Error deleting the user', error)
    res.status(500).json({ error: 'An error occurred while deleting the user' })
  }
}

async function changePassword (req, res) {
  logger.debug('UC - changePassword')
  const { currentPassword, newPassword } = req.body
  const userId = req.user.id

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } })

    if (!user) {
      logger.warn('UC - User not found')
      return res.status(404).json({ message: 'User not found' })
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password)
    if (!isMatch) {
      logger.warn('UC - Incorrect current password')
      return res.status(400).json({ message: 'Incorrect current password' })
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10)
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword }
    })
    logger.info('UC - Password changed successfully')
    res.json({ message: 'Password changed successfully' })
  } catch (error) {
    logger.error('UC - Error changing password:', error)
    res.status(500).json({ message: 'Error changing password', error })
  }
}

async function deleteUser (req, res) {
  logger.debug('UC - deleteUser')
  const userId = req.user.id

  try {
    // Eliminamos todas las tuplas relacionadas
    await prisma.diary.deleteMany({ where: { user_id: userId } })
    await prisma.completes.deleteMany({ where: { user_id: userId } })
    await prisma.userHabit.deleteMany({ where: { user_id: userId } })

    // Eliminamos el usuario definitivamente
    await prisma.user.delete({ where: { id: userId } })

    res.json({ message: 'Cuenta eliminada con éxito' })
    logger.info('UC - Cuenta eliminada con éxito')
  } catch (error) {
    logger.error('UC - Error al eliminar la cuenta:', error)
    res.status(500).json({ message: 'Error al eliminar la cuenta', error })
  }
}

async function findUserByEmail (emailParam) {
  logger.debug('UC - findUserByEmail')
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: emailParam
      }
    })
    return user
  } catch (error) {
    logger.error('UC - Error finding user by email:', error)
    return null
  }
}

async function findUserById (idParam) {
  logger.debug('UC - findUserById')
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: idParam
      }
    })
    return user
  } catch (error) {
    logger.error('UC - Error finding user by ID:', error)
    return null
  }
}

// funciones privadas
async function hashPassword (plainTextPassword) {
  const saltRounds = 10
  const hashedPassword = await bcrypt.hash(plainTextPassword, saltRounds)
  return hashedPassword
}

export default {
  getAllUsers,
  getUserInfo,
  getUserByUsername,
  createUser,
  updateUserById,
  updateUserByUsername,
  deleteUserById,
  deleteUserByUsername,
  findUserByEmail,
  findUserById,
  changePassword,
  deleteUser
}
