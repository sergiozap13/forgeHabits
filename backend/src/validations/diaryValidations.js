import { z } from 'zod'

export const diarySchema = z.object({
  text: z.string().max(500),
  mood: z.enum(['Bueno', 'Normal', 'Mal'])
})

export const updateDiarySchema = z.object({
  text: z.string().optional(),
  mood: z.enum(['Bueno', 'Normal', 'Mal']).optional()
})
