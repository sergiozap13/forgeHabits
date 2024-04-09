import { Router } from 'express'
import diaryController from '../controllers/diaryController.js'

export const diaryRouter = Router()

diaryRouter.get('/:day', diaryController.getDiaryDay)

diaryRouter.post('/:day', diaryController.createDiaryDay)

diaryRouter.patch('/:day', diaryController.updateDiaryDay)

diaryRouter.delete('/:day', diaryController.deleteDiaryDay)
