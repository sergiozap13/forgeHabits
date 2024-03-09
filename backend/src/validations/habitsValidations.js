import { z } from 'zod'
const objectIdSchema = z.string().length(24)

export const settingsSchema = z.object({
  daily_goal: z.number().nonnegative().optional(),
  preferred_hour: z.string().includes(':').length(5), // siempre va a contener : y como maximo 5 caracteres
  custom_color: z.string().max(6),
  commitment_level: z.enum(['Bueno', 'Superior', 'Interiorizado']), // nivel de compromiso
  intermediate_goal: z.number().int().gte(3).lte(14) // entre 3 y 14
})

export const habitUserSchema = z.object({
  habit_id: objectIdSchema,
  user_id: objectIdSchema,
  habit_user_type: z.enum(['Mantenimiento', 'Desarrollo, Cese']),
  status: z.enum(['SinIniciar', 'EnProceso', 'Forjado', 'Interiorizado']),
  current_streak: z.number().int().nonnegative(),
  best_streak: z.number().int().nonnegative(),
  times_forged: z.number().int().nonnegative(),
  times_forged_goal: z.number().int().nonnegative(),
  settings: settingsSchema
}).refine(data => data.best_streak >= data.current_streak, {
  message: 'La mejor racha debe ser mayor o igual a la actual'
})
