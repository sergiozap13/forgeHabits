import { z } from 'zod'

export const instructionSchema = z.object({
  instruction: z.array(z.string().max(200))
})

export const updateInstructionSchema = z.object({
  instruction: z.string().max(200)
})
