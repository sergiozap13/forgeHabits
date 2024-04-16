import { z } from 'zod'

export const userSchema = z.object({
  email: z.string().email(),
  name: z.string().max(50),
  last_name: z.string().max(100),
  phone: z.string().min(10).max(15).regex(/^\+[1-9]\d{1,14}$/),
  username: z.string(),
  password: z.string()
})

export const updateUserSchema = z.object({
  email: z.string().email().optional(),
  name: z.string().max(50).optional(),
  last_name: z.string().max(100).optional(),
  phone: z.string().min(10).max(15).regex(/^\+[1-9]\d{1,14}$/).optional(),
  username: z.string().optional(),
  password: z.string().optional()
})
