import { PrismaClient } from '@prisma/client'
import { instructionSchema, updateInstructionSchema } from '../validations/instructionsValidations.js'
const prisma = new PrismaClient()

async function getInstructionsById (req, res) {
  const instructions = await prisma.instruction.findMany({
    where: {
      category: req.params.category
    }
  })

  if (instructions.length === 0) { res.status(404).json({ message: 'Instructions not found' }) }

  res.json(instructions)
}

async function createInstructions (req, res) {
  const parsedData = instructionSchema.parse(req.body)

  try {
    const existingInstructionsCategory = await prisma.instruction.findFirst({
      where: {
        category: req.params.category
      }
    })

    if (existingInstructionsCategory) { return res.status(400).json({ error: 'The category is already created to instruction, use update' }) }

    const newInstruction = await prisma.instruction.create({
      data: {
        category: req.params.category,
        ...parsedData
      }
    })

    res.status(201).json(newInstruction)
  } catch (error) {
    res.status(500).json({ error: 'Something happens while creating a new instruction' })
  }
}

async function updateInstruction (req, res) {
  const newInstruction = updateInstructionSchema.parse(req.body)

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
      return res.status(404).json({ error: 'Instructions not found' })
    }

    if (currentInstructionsRecord.instruction.includes(newInstruction.instruction)) {
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
    res.status(500).json({ error: 'An error occurred while updating the instruction' })
  }
}

export default {
  getInstructionsById,
  createInstructions,
  updateInstruction
}
