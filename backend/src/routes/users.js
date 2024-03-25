import { Router } from 'express'
import usersController from '../controllers/usersController.js'

export const usersRouter = Router()

usersRouter.get('/', usersController.getAllUsers)

usersRouter.get('/:id', usersController.getUserById)

usersRouter.get('/username/:username', usersController.getUserByUsername)

usersRouter.post('/', usersController.createUser)

usersRouter.patch('/:id', usersController.updateUserById)

usersRouter.patch('/username/:username', usersController.updateUserByUsername)

usersRouter.delete('/:id', usersController.deleteUserById)

usersRouter.delete('/username/:username', usersController.deleteUserByUsername)
