import express from 'express'
import authController from '../controllers/authController.js'

export const authRouter = express.Router()

// post que manda el usuario si se autentica
authRouter.post('/login', authController.login)

// TODO: cambiar el método del logout a POST O GET
// borra la session y la cookie (se desloga)
// authRouter.delete('/logout', authController.logout)

authRouter.get('/status', authController.status)
