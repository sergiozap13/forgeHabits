import { Router } from 'express'

export const instructionsRouter = Router()

instructionsRouter.get('/:id', (req, res) => {
  res.json({
    _id: {
      $oid: '65db8e091f81498a80570523'
    },
    category: 'Inicio',
    instruction: 'En la sección de mis hábitos se ven todos los hábitos que tienes configurados.'
  })
})
