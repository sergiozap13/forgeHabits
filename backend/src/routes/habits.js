import { Router } from 'express'
import habitsController from '../controllers/habitsController.js'

export const habitsRouter = Router()

// cuando el usuario quiera ver todos los habitos disponibles que no tenga configurados
habitsRouter.get('/', habitsController.getAvailableHabits)

// cuando el usuario quiera ver los hábitos que tiene configurados
habitsRouter.get('/user', habitsController.getHabitsUser)

// cuando el usuario quiera ver la info de un habito en concreto
habitsRouter.get('/habit/:habit_id', habitsController.getHabitUserInfo)

// para obtener información del hábito
habitsRouter.get('/habit/:habit_id/info', habitsController.getHabitInfo)

// para los tips de los habitos
habitsRouter.get('/habit/:habit_id/tips', habitsController.getHabitTips)

habitsRouter.patch('/habit/:habit_id/tips', habitsController.updateHabitTips)

habitsRouter.get('/habit/:habit_id/unit', habitsController.getHabitUnit)
// para cuando se cree el hábito por primera vez.
habitsRouter.post('/habit/:habit_id', habitsController.createHabitUser)

// cuando el usuario edite su configuración del hábito
habitsRouter.patch('/habit/:habit_id/customize', habitsController.updateHabitUserSettings)

habitsRouter.patch('/habit/:habit_id', habitsController.updateHabitUserInfo)

habitsRouter.delete('/habit/:habit_id', habitsController.deleteHabitUser)
