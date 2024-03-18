import { Router } from 'express'
import instructionsController from '../controllers/instructionsController.js'

export const instructionsRouter = Router()

instructionsRouter.get('/:category', instructionsController.getInstructionsById)

instructionsRouter.post('/:category', instructionsController.createInstructions)

instructionsRouter.patch('/:category', instructionsController.updateInstruction)
