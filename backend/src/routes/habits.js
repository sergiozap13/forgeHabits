import { Router } from 'express'
import habitsController from '../controllers/habitsController.js'

export const habitsRouter = Router()

// TODO: quitar el id del usuario de las url -> cogerlo de sesion
// cuando el usuario quiera ver todos los habitos disponibles que no tenga configurados
habitsRouter.get('/', habitsController.getAvailableHabits)

// GET http://localhost:3000/api/habits/user/:user_id
// cuando el usuario quiera ver los hábitos que tiene configurados
habitsRouter.get('/user/:user_id', habitsController.getHabitsUser)

// cuando el usuario quiera ver la info de un habito en concreto
habitsRouter.get('/habit/:habit_id/user/:user_id', habitsController.getHabitUserInfo)

// para los tips de los habitos
habitsRouter.get('/habit/:habit_id/tips', habitsController.getHabitTips)

habitsRouter.get('/habit/:habit_id/unit', habitsController.getHabitUnit)
// para cuando se cree el hábito por primera vez.
habitsRouter.post('/habit/:habit_id/user/:user_id', habitsController.createHabitUser)

// cuando el usuario edite su configuración del hábito
habitsRouter.patch('/habit/:habit_id/user/:user_id/customize', habitsController.updateHabitUserSettings)

habitsRouter.delete('/habit/:id/user/:user_id', habitsController.deleteHabitUser)
