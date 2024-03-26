import express from 'express'
import authController from '../controllers/authController.js'

export const authRouter = express.Router()

// post que manda el usuario si se autentica
authRouter.post('/login', authController.login)

// borra la session y la cookie (se desloga)
authRouter.delete('/logout', authController.logout)
