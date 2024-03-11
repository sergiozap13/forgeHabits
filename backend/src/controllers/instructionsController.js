import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function getInstructionsById (req, res) {
  const instructions = await prisma.instructions.findMany({
    where: {
      category: req.params.category
    }
  })

  if (instructions === null) { res.status(404).json({ message: 'Instructions not found' }) }

  res.json(instructions)
}

export default {
  getInstructionsById
}
