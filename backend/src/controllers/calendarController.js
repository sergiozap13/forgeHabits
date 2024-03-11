import { PrismaClient } from '@prisma/client'
import { calendarSchema, updateCalendarEvent } from '../validations/calendarValidations.js'
const prisma = new PrismaClient()

async function get2DatesEvents (req, res) {
  const start = new Date(req.query.start_date)
  const end = new Date(req.query.end_date)

  if (start > end) { return res.status(400).json({ error: 'start date must be previous to end date' }) }

  if (isNaN(start) || isNaN(end)) {
    return res.status(400).json({ message: 'Invalid date in url.' })
  }

  const events = await prisma.calendar.findMany({
    where: {
      user_id: req.params.user_id,
      date: {
        gte: start,
        lte: end
      }
    }
  })

  if (events === null || events.length === 0) { res.status(404).json({ error: 'events not found between these dates' }) }

  res.json(events)
}

// TODO: colisiones con otros eventos
async function addEventToDay (req, res) {
  const parsedData = calendarSchema.parse(req.body)

  const date = new Date(req.params.day)
  if (isNaN(date)) {
    return res.status(400).json({ message: 'Invalid date in url.' })
  }

  const data = {
    ...parsedData,
    date
  }

  res.json(data)
}

async function updateEvent (req, res) {
  const parsedData = updateCalendarEvent.parse(req.body)

  const urlDate = new Date(req.params.day)
  if (isNaN(urlDate)) {
    return res.status(400).json({ message: 'Invalid date in url.' })
  }

  const eventToUpdate = await prisma.calendar.findFirst({
    where: {
      id: req.params.event_id,
      date: urlDate
    }
  })

  console.log(eventToUpdate)
  res.json(parsedData)
}

async function deleteEvent (req, res) {
  const urlDate = new Date(req.params.day)
  if (isNaN(urlDate)) {
    return res.status(400).json({ message: 'Invalid date in url.' })
  }

  const eventToDelete = await prisma.calendar.findFirst({
    where: {
      id: req.params.event_id,
      date: urlDate
    }

  })

  if (eventToDelete === null) { res.status(400).json({ message: 'The event doesn\'t exists' }) }

  console.log(eventToDelete)
}

export default {
  get2DatesEvents,
  addEventToDay,
  updateEvent,
  deleteEvent
}
