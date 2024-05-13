import { Router } from 'express'
import completesHabitsController from '../controllers/completesHabitsController.js'

export const completesHabitsRouter = Router()

// para obtener las completaciones de hábitos de un día
completesHabitsRouter.get('/:day', completesHabitsController.getCompletionsForDay)

// para agregar una completación de hábito
completesHabitsRouter.post('/', completesHabitsController.addCompletion)

//  para eliminar una completación de hábito
completesHabitsRouter.delete('/', completesHabitsController.deleteCompletion)
