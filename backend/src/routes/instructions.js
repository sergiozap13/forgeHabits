import { Router } from 'express'
import instructionsController from '../controllers/instructionsController.js'
import { checkAdmin } from '../controllers/authController.js'

export const instructionsRouter = Router()

instructionsRouter.get('/:category', instructionsController.getInstructionsById)

instructionsRouter.post('/:category', checkAdmin, instructionsController.createInstructions)

instructionsRouter.patch('/:category', checkAdmin, instructionsController.updateInstruction)
