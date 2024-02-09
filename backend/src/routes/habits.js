import { Router } from 'express'

export const habitsRouter = Router()

habitsRouter.get('/', (req, res) => {
  res.send('<h1>Mostrar todos los hábitos</h1>')
})

habitsRouter.get('/:id', (req, res) => {
  res.send(`<h1>Información sobre el hábito ${req.params.id} </h1>`)
})

habitsRouter.post('/', (req, res) => {
  res.json(req.body)
})

habitsRouter.delete('/:id', (req, res) => {
  res.send(`<h1>Borrar el hábito ${req.params.id}</h1>`)
})

habitsRouter.patch('/:id', (req, res) => {
  res.send(`<h1>Actualizar el hábito ${req.params.id} </h1>`)
})
