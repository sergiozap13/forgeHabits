import { PrismaClient } from '@prisma/client'
import { calendarSchema, updateCalendarEvent } from '../validations/calendarValidations.js'
import { validateHabitExistence, validateUserExistence } from '../validations/validationUtils.js'
import logger from '../logger.js'
const prisma = new PrismaClient()

async function get2DatesEvents (req, res) {
  logger.debug('CC - get2DatesEvents')
  try {
    const start = new Date(req.query.start_date)
    const end = new Date(req.query.end_date)

    if (start > end) {
      logger.warn('CC - start date must be previous to end date')
      return res.status(400).json({ error: 'start date must be previous to end date' })
    }

    if (isNaN(start) || isNaN(end)) {
      logger.warn('CC - Invalid date in url.')
      return res.status(400).json({ message: 'Invalid date in url.' })
    }

    const events = await prisma.calendarEvent.findMany({
      where: {
        user_id: req.user.id,
        date: {
          gte: start,
          lte: end
        }
      }
    })

    if (!events.length) {
      logger.warn('CC - events not found between these dates')
      res.status(404).json({ error: 'events not found between these dates' })
    }

    res.json(events)
  } catch (error) {
    if (error.name === 'ZodError') {
      logger.warn('CC - ZodError')
      return res.status(400).json({ errors: error.errors })
    } else {
      logger.error('CC - Error in get2DatesEvents ' + error.message)
      return res.status(500).json({ error: error.message })
    }
  }
}

async function addEventToDay (req, res) {
  logger.debug('CC - addEventToDay')
  try {
    const parsedData = calendarSchema.parse(req.body)

    if (!await validateUserExistence(req.user.id)) {
      logger.warn('CC - BD error. The user doesnt exists')
      return res.status(400).json({ message: 'BD error. The user doesnt exists' })
    }
    if (!await validateHabitExistence(parsedData.habit_id)) {
      logger.warn('CC - BD error. The habit doesnt exists')
      return res.status(400).json({ message: 'BD error. The habit doesnt exists' })
    }

    // comprobacion fecha valida url
    const date = new Date(req.params.day)
    if (isNaN(date)) {
      logger.warn('CC - Invalid date in url.')
      return res.status(400).json({ message: 'Invalid date in url.' })
    }

    // comprobacion para chequear si el usuario tiene el habito configurado
    if (parsedData.habit_id && parsedData.type === 'Habito') {
      const hasUserHabit = await prisma.userHabit.findFirst({
        where: {
          habit_id: parsedData.habit_id,
          user_id: req.user.id
        }
      })

      if (hasUserHabit === null) {
        logger.warn('CC - The user hasnt this habit')
        return res.status(400).json({ message: 'The user hasnt this habit' })
      }
    }

    // comprobacion habito dia completo
    const allDayHabit = await prisma.habit.findFirst({
      where: {
        id: parsedData.habit_id
      },
      select: {
        allday: true
      }
    })

    // si es habito de dia completo, no puede tener horario, por lo cual, falla
    if (allDayHabit.allday) {
      if (parsedData.schedule) {
        logger.warn('CC - This habit has not schedule')
        return res.status(400).json({ error: 'This habit has not schedule' })
      }
    } else { // si no es de dia completo, se comprueban que las horas sean correctas
      const startTime = new Date(`1970-01-01T${parsedData.schedule.start}`)
      const endTime = new Date(`1970-01-01T${parsedData.schedule.end}`)
      // comprobación de las horas
      if (startTime >= endTime) {
        logger.warn('CC - start time must be earlier than end time.')
        return res.status(400).json({ message: 'start time must be earlier than end time.' })
      }
      // se chequean las colisiones
      if (await checkEventCollisions(date, startTime, endTime)) {
        logger.warn('CC - event time conflicts with another event.')
        return res.status(400).json({ message: 'event time conflicts with another event.' })
      }
    }

    // los habitos de dia completo solo pueden ser configurados una vez al día
    if (await checkAllDayHabitAlreadySetForDay(date, parsedData.habit_id, req.user.id)) {
      logger.warn('CC - this event can only be set once per day')
      return res.status(400).json({ message: 'this event can only be set once per day' })
    }

    const data = {
      ...parsedData,
      user_id: req.user.id,
      date
    }

    const habitCreated = await prisma.calendarEvent.create({
      data: {
        ...data
      }
    })

    if (habitCreated) { res.json(data) } else {
      logger.warn('CC - an error ocurred while creating the event')
      res.status(500).json({ error: 'an error ocurred while creating the event' })
    }
  } catch (error) {
    if (error.name === 'ZodError') {
      logger.warn('CC - ZodError')
      return res.status(400).json({ errors: error.errors })
    } else {
      logger.error('CC - Error in addEventToDay ' + error.message)
      return res.status(500).json({ error: error.message })
    }
  }
}

async function updateEvent (req, res) {
  logger.debug('CC - updateEvent')
  try {
    const parsedData = updateCalendarEvent.parse(req.body)
    // Comprobación de fecha válida
    const urlDate = new Date(req.params.day)
    if (isNaN(urlDate)) {
      logger.warn('CC - Invalid date in url.')
      return res.status(400).json({ message: 'Invalid date in url.' })
    }
    // comprobación de que existe el evento
    const eventToUpdate = await prisma.calendarEvent.findFirst({
      where: {
        id: req.params.event_id,
        date: urlDate
      }
    })

    if (eventToUpdate === null) {
      logger.warn('CC - Event not found: ')
      return res.status(404).json({ error: 'Event not found' })
    }
    // comprobacion habito de dia completo
    const allDayHabit = await prisma.habit.findFirst({
      where: {
        id: eventToUpdate.habit_id
      },
      select: {
        allday: true
      }
    })
    // si el evento no existe, se devuelve un 404

    if (parsedData.schedule) {
      // si en el body viene un schedule y el habito es de dia completo, se devuelve un 400
      if (allDayHabit.allday) {
        logger.warn('CC - This event cant have schedule')
        return res.status(400).json({ error: 'This event cant have schedule' })
      }
      // se crean objetos Date con las hora para que no se pueda mandar una hora de comienzo posterior a la de finalización
      const startTime = new Date(`1970-01-01T${parsedData.schedule.start}`)
      const endTime = new Date(`1970-01-01T${parsedData.schedule.end}`)
      // comprobación de las horas
      if (startTime >= endTime) {
        logger.warn('CC - start time must be earlier than end time.')
        return res.status(400).json({ message: 'start time must be earlier than end time.' })
      }
      // se chequean las colisiones
      if (await checkEventCollisions(urlDate, startTime, endTime, eventToUpdate.id)) {
        logger.warn('CC - event time conflicts with another event.')
        return res.status(400).json({ message: 'event time conflicts with another event.' })
      }
    }

    const eventUpdated = await prisma.calendarEvent.update({
      where: {
        id: eventToUpdate.id
      },
      data: {
        ...parsedData
      }
    })
    // si se ha actualizado bien, se devuelve
    if (eventUpdated) { res.status(200).json(eventUpdated) } else {
      logger.error('CC - Something ocurred while the event was being updated')
      res.status(500).json({ error: 'Something ocurred while the event was being updated' })
    }
  } catch (error) {
    if (error.name === 'ZodError') {
      logger.warn('CC - ZodError')
      return res.status(400).json({ errors: error.errors })
    } else {
      logger.error('CC - Error in updateEvent ' + error.message)
      return res.status(500).json({ error: error.message })
    }
  }
}

// funciones para comprobaciones de colisiones
async function checkEventCollisions (eventDate, newStartTime, newEndTime, excludeEventId = '') {
  logger.debug('CC - checkEventCollisions')
  const eventsOfTheDay = await prisma.calendarEvent.findMany({
    where: {
      date: eventDate,
      id: { not: excludeEventId } // excluir el evento actual si es una actualización
    }
  })
  // se recorren todos los eventos de ese dia y se busca colision
  for (const event of eventsOfTheDay) {
    if (event.schedule) {
      const existingStartTime = new Date(`1970-01-01T${event.schedule.start}`)
      const existingEndTime = new Date(`1970-01-01T${event.schedule.end}`)
      // colision
      if (newStartTime < existingEndTime && newEndTime > existingStartTime) {
        return true
      }
    }
  }

  return false
}

// funcion para comprobar si este habito de día completo ya está configurado
async function checkAllDayHabitAlreadySetForDay (eventDate, habitId, userId) {
  // combinamos la consulta para que devuelva tambien informacion sobre el habito
  const existingEvent = await prisma.calendarEvent.findFirst({
    where: {
      date: eventDate,
      habit_id: habitId,
      user_id: userId,
      habit: {
        allday: true
      }
    },
    include: {
      habit: true
    }
  })

  // devuelve true si existe un evento de día completo para el mismo hábito y usuario en la misma fecha
  return !!existingEvent
}

async function deleteEvent (req, res) {
  logger.debug('CC - deleteEvent')
  try {
    const urlDate = new Date(req.params.day)
    if (isNaN(urlDate)) {
      logger.warn('CC - Invalid date in url.')
      return res.status(400).json({ message: 'Invalid date in url.' })
    }

    const deletedEvent = await prisma.calendarEvent.delete({
      where: {
        id: req.params.event_id,
        date: urlDate
      }
    })

    res.status(200).json(deletedEvent)
  } catch (error) {
    // si el evento no existe, prisma nos devolverá un error específico
    if (error.code === 'P2025') {
      logger.warn('CC - event not found.')
      return res.status(404).json({ error: 'event not found.' })
    }

    res.status(500).json({ message: 'An error occurred while deleting the event.' })
  }
}

export default {
  get2DatesEvents,
  addEventToDay,
  updateEvent,
  deleteEvent
}
