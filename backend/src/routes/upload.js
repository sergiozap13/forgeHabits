import { Router } from 'express'
import upload from '../config/multerConfig.js'
import uploadController from '../controllers/uploadController.js'
import rateLimit from 'express-rate-limit'

export const uploadRouter = Router()

// Limitador de velocidad para subidas de archivos (10 solicitudes por 15 minutos)
const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Too many uploads from this IP, please try again later.'
})

uploadRouter.post('/', uploadLimiter, upload.single('profileImage'), uploadController.uploadProfileImage)
