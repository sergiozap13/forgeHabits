import { Router } from 'express'
import habitsController from '../controllers/habitsController.js'
import { checkAuthenticated } from '../controllers/authController.js'

export const habitsRouter = Router()

// cuando el usuario quiera ver todos los habitos disponibles que no tenga configurados
habitsRouter.get('/', checkAuthenticated, habitsController.getAvailableHabits)

// cuando el usuario quiera ver los hábitos que tiene configurados
habitsRouter.get('/user', checkAuthenticated, habitsController.getHabitsUser)

// cuando el usuario quiera ver la info de un habito en concreto
habitsRouter.get('/habit/:habit_id', checkAuthenticated, habitsController.getHabitUserInfo)

// para los tips de los habitos
habitsRouter.get('/habit/:habit_id/tips', checkAuthenticated, habitsController.getHabitTips)

habitsRouter.patch('/habit/:habit_id/tips', checkAuthenticated, habitsController.updateHabitTips)

habitsRouter.get('/habit/:habit_id/unit', checkAuthenticated, habitsController.getHabitUnit)
// para cuando se cree el hábito por primera vez.
habitsRouter.post('/habit/:habit_id', checkAuthenticated, habitsController.createHabitUser)

// cuando el usuario edite su configuración del hábito
habitsRouter.patch('/habit/:habit_id/customize', checkAuthenticated, habitsController.updateHabitUserSettings)

habitsRouter.patch('/habit/:habit_id', checkAuthenticated, habitsController.updateHabitUserInfo)

habitsRouter.delete('/habit/:habit_id', checkAuthenticated, habitsController.deleteHabitUser)
