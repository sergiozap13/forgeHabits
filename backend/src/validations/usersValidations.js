import { z } from 'zod'
// const objectIdSchema = z.string().length(36)

export const userSchema = z.object({
  email: z.string().email(),
  name: z.string().max(50),
  last_name: z.string().max(100),
  date_born: z.string().datetime(),
  username: z.string(),
  password: z.string()
})

export const updateUserSchema = z.object({
  email: z.string().email().optional(),
  name: z.string().max(50).optional(),
  last_name: z.string().max(100).optional(),
  date_born: z.string().datetime().optional(),
  username: z.string().optional(),
  password: z.string().optional()
})
