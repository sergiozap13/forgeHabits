import { Router } from 'express'

export const calendarRouter = Router()

// esto va a ser la general para mostrar todos los eventos de la semana elegida
// /api/calendar/all?start_date=2024-02-5&end_date=2024-02-11
calendarRouter.get('/all', (req, res) => {
  console.log(req.query.start_date)
  console.log(req.query.end_date)
  res.json(
    [
      {
        _id: {
          $oid: '65db8a3c1f81498a805704e4'
        },
        habit_id: '65db856f1f81498a805704d6',
        user_id: 'x',
        date: {
          $date: '2024-02-25T00:00:00.000Z'
        },
        done: true,
        type: 'habit',
        schedule: {
          start: '13:00',
          end: '14:00'
        }
      },
      {
        _id: {
          $oid: '65dcac32eeb04ad0b4db0dcf'
        },
        user_id: 'x',
        date: {
          $date: '2024-02-26T00:00:00.000Z'
        },
        type: 'event',
        event_name: 'Trabajar',
        schedule: {
          start: '12:00',
          end: '13:00'
        }
      },
      {
        _id: {
          $oid: '65db8ad21f81498a805704e6'
        },
        habit_id: '65db856f1f81498a805704d6',
        user_id: 'x',
        date: {
          $date: '2024-02-25T00:00:00.000Z'
        },
        done: true,
        type: 'habit'
      }
    ]
  )
})

// Post para añadir eventos al calendario
calendarRouter.post('/:day', (req, res) => {
  res.send(req.body)
})

calendarRouter.patch('/:day', (req, res) => {
  res.send(req.body)
})

calendarRouter.delete('/:day/id/:event_id', (req, res) => {
  res.json(
    {
      _id: {
        $oid: '65db8ad21f81498a805704e6'
      },
      habit_id: '65db856f1f81498a805704d6',
      user_id: 'x',
      date: {
        $date: '2024-02-25T00:00:00.000Z'
      },
      done: true,
      type: 'habit'
    }
  )
})

calendarRouter.get('/:day', (req, res) => {
  console.log(req.params.day)
  res.json(
    [
      {
        _id: {
          $oid: '65db8a3c1f81498a805704e4'
        },
        habit_id: '65db856f1f81498a805704d6',
        user_id: 'x',
        date: {
          $date: '2024-02-25T00:00:00.000Z'
        },
        done: true,
        type: 'habit',
        schedule: {
          start: '13:00',
          end: '14:00'
        }
      },
      {
        _id: {
          $oid: '65dcac32eeb04ad0b4db0dcf'
        },
        user_id: 'x',
        date: {
          $date: '2024-02-26T00:00:00.000Z'
        },
        type: 'event',
        event_name: 'Trabajar',
        schedule: {
          start: '12:00',
          end: '13:00'
        }
      },
      {
        _id: {
          $oid: '65db8ad21f81498a805704e6'
        },
        habit_id: '65db856f1f81498a805704d6',
        user_id: 'x',
        date: {
          $date: '2024-02-25T00:00:00.000Z'
        },
        done: true,
        type: 'habit'
      }
    ]
  )
})
