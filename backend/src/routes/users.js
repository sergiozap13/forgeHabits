import { Router } from 'express'
import usersController from '../controllers/usersController.js'
import { checkAuthenticated, checkAdmin } from '../controllers/authController.js'

export const usersRouter = Router()

// TODO: revisar los permisos de estas rutas para actualizar y borrar

usersRouter.get('/', checkAuthenticated, checkAdmin, usersController.getAllUsers)

usersRouter.get('/:id', checkAuthenticated, checkAdmin, usersController.getUserById)

usersRouter.get('/username/:username', checkAuthenticated, checkAdmin, usersController.getUserByUsername)
// para crear no puede estar autenticado porque sino no podrían registrarse los usuarios
usersRouter.post('/', usersController.createUser)

usersRouter.patch('/:id', checkAuthenticated, usersController.updateUserById)

usersRouter.patch('/username/:username', checkAuthenticated, usersController.updateUserByUsername)

usersRouter.delete('/:id', checkAuthenticated, usersController.deleteUserById)

usersRouter.delete('/username/:username', checkAuthenticated, usersController.deleteUserByUsername)
