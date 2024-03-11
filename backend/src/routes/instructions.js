import { Router } from 'express'
import instructionsController from '../controllers/instructionsController.js'

export const instructionsRouter = Router()

instructionsRouter.get('/:category', instructionsController.getInstructionsById)
