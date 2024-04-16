import express from 'express'
import authController from '../controllers/authController.js'

export const authRouter = express.Router()

// post que manda el usuario si se autentica
authRouter.post('/login', authController.login)

// get para consultar si el usuario está o no logado
authRouter.post('/status', authController.status)
