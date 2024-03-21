import { z } from 'zod'
const objectIdSchema = z.string().length(36)

const scheduleSchema = z.object({
  start: z.string().length(5).includes(':'),
  end: z.string().length(5).includes(':')
})

export const calendarSchema = z.object({
  habit_id: objectIdSchema.optional(),
  user_id: objectIdSchema,
  done: z.boolean().optional(),
  type: z.enum(['Habito', 'Evento']),
  schedule: scheduleSchema.optional()
})

export const updateCalendarEvent = z.object({
  done: z.boolean().optional(),
  schedule: scheduleSchema.optional()
})
