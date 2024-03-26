import { Router } from 'express'
import diaryController from '../controllers/diaryController.js'
import { checkAuthenticated } from '../controllers/authController.js'

export const diaryRouter = Router()

diaryRouter.get('/:day', checkAuthenticated, diaryController.getDiaryDay)

diaryRouter.post('/:day', checkAuthenticated, diaryController.createDiaryDay)

diaryRouter.patch('/:day', checkAuthenticated, diaryController.updateDiaryDay)

diaryRouter.delete('/:day', checkAuthenticated, diaryController.deleteDiaryDay)
