import { z } from 'zod'
const objectIdSchema = z.string().length(36)

export const settingsSchema = z.object({
  daily_goal: z.number().nonnegative().optional(),
  preferred_hour: z.string().includes(':').length(5), // siempre va a contener : y como maximo 5 caracteres
  custom_color: z.string().max(6).min(3),
  commitment_level: z.enum(['Bueno', 'Superior', 'Interiorizado']), // nivel de compromiso
  intermediate_goal: z.number().int().gte(3).lte(14) // entre 3 y 14
})

export const updateSettingsSchema = z.object({
  daily_goal: z.number().nonnegative().optional(),
  preferred_hour: z.string().includes(':').length(5).optional(), // siempre va a contener : y como maximo 5 caracteres
  custom_color: z.string().max(6).min(3).optional(),
  commitment_level: z.enum(['Bueno', 'Superior', 'Interiorizado']).optional(), // nivel de compromiso
  intermediate_goal: z.number().int().gte(3).lte(14).optional()
})

export const updateUserHabitInfo = z.object({
  status: z.enum(['SinIniciar', 'EnProceso', 'Forjado', 'Interiorizado']).optional(),
  current_streak: z.number().int().nonnegative().optional(),
  best_streak: z.number().int().nonnegative().optional(),
  times_forged: z.number().int().nonnegative().optional()
})

export const habitUserSchema = z.object({
  habit_id: objectIdSchema.optional(),
  user_id: objectIdSchema.optional(),
  habit_user_type: z.enum(['Mantenimiento', 'Desarrollo', 'Cese']),
  status: z.enum(['SinIniciar', 'EnProceso', 'Forjado', 'Interiorizado']),
  current_streak: z.number().int().nonnegative(),
  best_streak: z.number().int().nonnegative(),
  times_forged: z.number().int().nonnegative(),
  times_forged_goal: z.number().int().nonnegative(),
  settings: settingsSchema
}).refine(data => data.best_streak >= data.current_streak, {
  message: 'La mejor racha debe ser mayor o igual a la actual'
})

export const tipSchema = z.object({
  tip: z.string().max(200)
})
