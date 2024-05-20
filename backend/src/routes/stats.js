import { Router } from 'express'
import statsController from '../controllers/statsController.js'

export const statsRouter = Router()

statsRouter.get('/best', statsController.getBestHabit)

statsRouter.get('/forged', statsController.getForgedHabitsSum)

statsRouter.get('/performance', statsController.getUserPerformance)
