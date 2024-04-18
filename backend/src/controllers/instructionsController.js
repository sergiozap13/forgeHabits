import { PrismaClient } from '@prisma/client'
import { instructionSchema, updateInstructionSchema } from '../validations/instructionsValidations.js'
import logger from '../logger.js'
const prisma = new PrismaClient()

async function getInstructionsById (req, res) {
  logger.debug('IC - getInstructionsById')
  const category = categoryValidation(req.params.category, res)
  if (!category) {
    logger.warn("IC - The category doesn't exists")
    return res.status(400).json({ message: "The category doesn't exists" })
  }

  try {
    const instructions = await prisma.instruction.findMany({
      where: {
        category: req.params.category
      }
    })

    if (instructions.length === 0) {
      logger.warn('IC - Instructions not found')
      return res.status(404).json({ message: 'Instructions not found' })
    }

    res.json(instructions)
  } catch (error) {
    if (error.name === 'ZodError') {
      logger.error('IC - ZodError')
      return res.status(400).json({ errors: error.errors })
    }
    logger.error('IC - Error getting the instructions', error)
    return res.status(500).json({ error: error.message })
  }
}

async function createInstructions (req, res) {
  logger.debug('IC - createInstructions')
  const parsedData = instructionSchema.parse(req.body)

  const category = categoryValidation(req.params.category, res)
  if (!category) {
    logger.warn("IC - The category doesn't exists")
    return res.status(400).json({ message: "The category doesn't exists" })
  }

  try {
    const existingInstructionsCategory = await prisma.instruction.findFirst({
      where: {
        category: req.params.category
      }
    })

    if (existingInstructionsCategory) {
      logger.warn('IC - The category is already created to instruction, use update')
      return res.status(400).json({ error: 'The category is already created to instruction, use update' })
    }

    const newInstruction = await prisma.instruction.create({
      data: {
        category: req.params.category,
        ...parsedData
      }
    })

    res.status(201).json(newInstruction)
  } catch (error) {
    if (error.name === 'ZodError') {
      logger.warn('IC - ZodError')
      return res.status(400).json({ errors: error.errors })
    } else {
      logger.error('IC - Error creating the instructions', error)
      return res.status(500).json({ error: error.message })
    }
  }
}

async function updateInstruction (req, res) {
  logger.debug('IC - updateInstruction')
  const newInstruction = updateInstructionSchema.parse(req.body)

  const category = categoryValidation(req.params.category, res)
  if (!category) {
    logger.warn("IC - The category doesn't exists")
    return res.status(400).json({ message: "The category doesn't exists" })
  }
  try {
    const currentInstructionsRecord = await prisma.instruction.findFirst({
      where: {
        category: req.params.category
      },
      select: {
        id: true,
        instruction: true
      }
    })

    if (!currentInstructionsRecord) {
      logger.warn('IC - Instructions not found')
      return res.status(404).json({ error: 'Instructions not found' })
    }

    if (currentInstructionsRecord.instruction.includes(newInstruction.instruction)) {
      logger.warn('IC - Instruction already exists')
      return res.status(400).json({ error: 'Instruction already exists' })
    }
    // actualizar el array de tips
    const updatedInstructions = [...currentInstructionsRecord.instruction, newInstruction.instruction]
    // actualizar el registro con el nuevo array
    const updatedTipEntry = await prisma.instruction.update({
      where: {
        id: currentInstructionsRecord.id
      },
      data: {
        instruction: updatedInstructions
      }
    })

    res.status(200).json(updatedTipEntry)
  } catch (error) {
    if (error.name === 'ZodError') {
      logger.warn('IC - ZodError')
      return res.status(400).json({ errors: error.errors })
    } else {
      logger.error('IC - Error updating the instructions', error)
      return res.status(500).json({ error: error.message })
    }
  }
}

function categoryValidation (category) {
  logger.debug('IC - categoryValidation')
  const validCategories = ['Inicio', 'MisHabitos', 'Diario', 'Calendario']

  if (!validCategories.includes(category)) {
    return false
  }

  return true
}

export default {
  getInstructionsById,
  createInstructions,
  updateInstruction
}
