import { z } from 'zod'

const objectIdSchema = z.string().length(36)

export const diarySchema = z.object({
  user_id: objectIdSchema,
  // date: z.string().refine(date => !isNaN(Date.parse(date)), { // analiza el string como una fecha
  //   message: 'El formato de la fecha es inválido'
  // }),
  text: z.string().max(500),
  mood: z.enum(['Bueno', 'Normal', 'Mal'])
})

export const updateDiarySchema = z.object({
  text: z.string().optional(),
  mood: z.enum(['Bueno', 'Normal', 'Mal']).optional()
})
