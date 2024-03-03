import { Router } from 'express'

export const diaryRouter = Router()

diaryRouter.get('/:day', (req, res) => {
  console.log(req.params.day)
  res.json({
    _id: {
      $oid: '65db8bb21f81498a805704f5'
    },
    user_id: 'x',
    date: {
      $date: '2024-02-25T00:00:00.000Z'
    },
    text: 'Hola, soy Sergio Zapata y soy ingeniero.',
    mood: 'Normal'
  })
})

// POST http://localhost:3000/api/diary/2024-02-11

diaryRouter.post('/:day', (req, res) => {
  console.log(req.params.day)
  res.send(req.body)
})

// PATCH http://localhost:3000/api/diary/2024-02-11

diaryRouter.patch('/:day', (req, res) => {
  console.log(req.params.day)
  res.send(req.body)
})
