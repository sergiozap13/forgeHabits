import { z } from 'zod'

export const updateSettingsSchema = z.object({
  daily_goal: z.number().nonnegative().optional(),
  preferred_hour: z.string().includes(':').length(5).optional(), // siempre va a contener : y como maximo 5 caracteres
  custom_color: z.string().max(6).min(3).optional(),
  commitment_level: z.enum(['Bueno', 'Superior', 'Interiorizado']).optional() // nivel de compromiso
})

export const updateUserHabitInfo = z.object({
  status: z.enum(['SinIniciar', 'EnProceso', 'Forjado', 'Interiorizado']).optional(),
  current_streak: z.number().int().nonnegative().optional(),
  best_streak: z.number().int().nonnegative().optional(),
  times_forged: z.number().int().nonnegative().optional()
})

export const habitUserSchema = z.object({
  daily_goal: z.number().nonnegative().optional(),
  preferred_hour: z.string().includes(':').length(5), // siempre va a contener : y como maximo 5 caracteres
  custom_color: z.string().max(6).min(3).optional(),
  commitment_level: z.enum(['Bueno', 'Superior', 'Interiorizado']) // nivel de compromiso
})

export const tipSchema = z.object({
  tip: z.string().max(200)
})
