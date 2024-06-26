import { Router } from 'express'
import usersController from '../controllers/usersController.js'
import { checkAdmin } from '../controllers/authController.js'

export const usersRouter = Router()

// TODO: revisar los permisos de estas rutas para actualizar y borrar

usersRouter.get('/', checkAdmin, usersController.getAllUsers)

usersRouter.get('/info', usersController.getUserInfo)

usersRouter.get('/username/:username', checkAdmin, usersController.getUserByUsername)
// para crear no puede estar autenticado porque sino no podrían registrarse los usuarios
usersRouter.post('/create', usersController.createUser)

usersRouter.post('/changepass', usersController.changePassword)

usersRouter.patch('/:id', usersController.updateUserById)

usersRouter.patch('/username/:username', usersController.updateUserByUsername)

usersRouter.delete('/:id', usersController.deleteUserById)

usersRouter.delete('/username/:username', usersController.deleteUserByUsername)

usersRouter.delete('/', usersController.deleteUser)
