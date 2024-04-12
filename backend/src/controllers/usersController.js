import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { userSchema, updateUserSchema } from '../validations/usersValidations.js'
const prisma = new PrismaClient()

async function getAllUsers (req, res) {
  try {
    const allUsers = await prisma.user.findMany()

    res.status(200).json(allUsers)
  } catch (error) {
    res.status(500).json({ error: 'Algo ocurrió recuperando los usuarios' })
  }
}

async function getUserById (req, res) {
  const idParam = req.params.id
  try {
    const user = await prisma.user.findFirst({
      where: {
        id: idParam
      }
    })

    if (user === null) { return res.status(404).json({ messsage: 'user not found' }) }

    res.status(200).json(user)
  } catch (error) {
    res.status(500).json({ errors: error })
  }
}

async function getUserByUsername (req, res) {
  const usernameParam = req.params.username
  try {
    const user = await prisma.user.findFirst({
      where: {
        username: usernameParam
      }
    })

    if (user === null) { return res.status(404).json({ messsage: 'user not found' }) }

    res.status(200).json(user)
  } catch (error) {
    res.status(500).json({ errors: error })
  }
}

async function createUser (req, res) {
  const parsedData = userSchema.parse(req.body)

  try {
    const existingEmail = await prisma.user.findUnique({
      where: {
        email: parsedData.email
      }
    })

    if (existingEmail) {
      return res.status(400).json({ message: 'Email already exists' })
    }

    const existingUsername = await prisma.user.findUnique({
      where: {
        username: parsedData.username
      }
    })

    if (existingUsername) {
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
    res.status(500).json({ errors: error })
  }
}

async function updateUserById (req, res) {
  const userId = req.params.id
  const updateData = updateUserSchema.parse(req.body)

  if (Object.keys(updateData).length === 0) { return res.status(400).json({ message: 'No update data provided' }) }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!existingUser) {
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
    res.status(500).json({ error: error.message })
  }
}

async function updateUserByUsername (req, res) {
  const username = req.params.username
  const updateData = updateUserSchema.parse(req.body)

  if (Object.keys(updateData).length === 0) { return res.status(400).json({ message: 'No update data provided' }) }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { username }
    })

    if (!existingUser) {
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
    res.status(500).json({ error: error.message })
  }
}

async function deleteUserById (req, res) {
  const userId = req.params.id

  try {
    const existingUser = await prisma.user.findUnique({ where: { id: userId } })

    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' })
    }

    await prisma.user.delete({ where: { id: userId } })
    res.status(200).json({ message: 'User successfully deleted' })
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while deleting the user' })
  }
}

async function deleteUserByUsername (req, res) {
  const username = req.params.username

  try {
    const existingUser = await prisma.user.findUnique({ where: { username } })

    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' })
    }

    await prisma.user.delete({ where: { username } })
    res.status(200).json({ message: 'User successfully deleted' })
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while deleting the user' })
  }
}

async function findUserByEmail (emailParam) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: emailParam
      }
    })
    return user
  } catch (error) {
    console.error('Error buscando usuario por email:', error)
    return null
  }
}

async function findUserById (idParam) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: idParam
      }
    })
    return user
  } catch (error) {
    console.error('Error buscando usuario por ID:', error)
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
  getUserById,
  getUserByUsername,
  createUser,
  updateUserById,
  updateUserByUsername,
  deleteUserById,
  deleteUserByUsername,
  findUserByEmail,
  findUserById
}
