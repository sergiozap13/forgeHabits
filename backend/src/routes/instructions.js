import { Router } from 'express'
import instructionsController from '../controllers/instructionsController.js'
import { checkAuthenticated, checkAdmin } from '../controllers/authController.js'

export const instructionsRouter = Router()

instructionsRouter.get('/:category', checkAuthenticated, instructionsController.getInstructionsById)

instructionsRouter.post('/:category', checkAuthenticated, checkAdmin, instructionsController.createInstructions)

instructionsRouter.patch('/:category', checkAuthenticated, checkAdmin, instructionsController.updateInstruction)
