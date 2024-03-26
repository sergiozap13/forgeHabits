import { Router } from 'express'
import calendarController from '../controllers/calendarController.js'
import { checkAuthenticated } from '../middlewares/passport-config.js'

export const calendarRouter = Router()
// esto va a ser la general para mostrar todos los eventos de la semana elegida
// /api/calendar/all?start_date=2024-02-5&end_date=2024-02-11
calendarRouter.get('/all', checkAuthenticated, calendarController.get2DatesEvents)

// Post para añadir eventos al calendario
calendarRouter.post('/:day', checkAuthenticated, calendarController.addEventToDay)

calendarRouter.patch('/:day/event/:event_id', checkAuthenticated, calendarController.updateEvent)

calendarRouter.delete('/:day/id/:event_id', checkAuthenticated, calendarController.deleteEvent)
