import { Router } from 'express'
import { authorizeImageAccess } from '../middlewares/imageAccess.js'
import imageController from '../controllers/imageController.js'

export const imageRouter = Router()

imageRouter.get('/:userId', authorizeImageAccess, imageController.getProfileImage)
