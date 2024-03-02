import { Router } from 'express'

export const habitsRouter = Router()

habitsRouter.get('/', (req, res) => {
  const sampleHabits = [
    {
      _id: '65db738f567eda516b8aa36c',
      name: 'Comer saludable',
      category: 'Salud física',
      default_color: '5ee76a',
      default_hour: '13:00',
      habit_type: 'AllDay'
    },
    {
      _id: '65db856f1f81498a805704d6',
      name: 'Beber agua',
      category: 'Salud física',
      default_color: '01aeff',
      default_hour: '07:00',
      habit_type: 'AllDay'
    }
  ]

  res.json(sampleHabits)
})

// GET http://localhost:3000/api/habits/user/:user_id

habitsRouter.get('/user/:user_id', (req, res) => {
  // TODO: Para este endpoint habrá que hacer varias consultas para obtener el nombre del hábito
  // y la racha actual de este. Esta info que se muestra no es la real
  const sampleHabits = [
    {
      _id: '65db738f567eda516b8aa36c',
      name: 'Comer saludable',
      category: 'Salud física',
      default_color: '5ee76a',
      default_hour: '13:00',
      habit_type: 'AllDay'
    },
    {
      _id: '65db856f1f81498a805704d6',
      name: 'Beber agua',
      category: 'Salud física',
      default_color: '01aeff',
      default_hour: '07:00',
      habit_type: 'AllDay'
    }
  ]

  res.json(sampleHabits)
})

habitsRouter.get('/habit/:habit_id/user/:user_id', (req, res) => {
  // habría que buscar los hábitos asociados al usuario y para cada hábito
  // obtener su información. Luego, mandar la información conjunta todo en un mismo json

  res.json({
    habit_id: '65db738f567eda516b8aa36c',
    user_id: 'x',
    habit_user_type: 'Mantenimiento',
    status: 'En proceso de ser forjado',
    current_streak: 10,
    best_streak: 18,
    times_forged: 0,
    times_forged_goal: 3,
    settings: {
      preferred_hour: '12:00',
      custom_color: 'ff01e4',
      commitment_level: 'Superior',
      intermediate_goal: 7
    },
    habit_details: {
      name: 'Comer saludable',
      category: 'Salud física',
      default_color: '5ee76a',
      default_hour: '13:00',
      habit_type: 'AllDay'
    }
  })
})

// PATCH http://localhost:3000/habits/habit/:habit_id/user/:user_id/customize
habitsRouter.patch('/habit/:habit_id/user/:user_id/customize', (req, res) => {
  res.json(req.body)
})
// para cuando se cree el hábito por primera vez.
habitsRouter.post('/habit/:habit_id/user/:user_id', (req, res) => {
  res.json(req.body)
})

habitsRouter.delete('/:id', (req, res) => {
  res.send(`<h1>Borrar el hábito ${req.params.id}</h1>`)
})

habitsRouter.patch('/:id', (req, res) => {
  res.send(`<h1>Actualizar el hábito ${req.params.id} </h1>`)
})
