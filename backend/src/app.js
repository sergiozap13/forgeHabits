// archivo con el servidor
import express, { json } from 'express'
import { corsMiddleware } from './middlewares/cors.js'
import { habitsRouter } from './routes/habits.js'
import { calendarRouter } from './routes/calendar.js'
import { diaryRouter } from './routes/diary.js'
import { instructionsRouter } from './routes/instructions.js'
import { usersRouter } from './routes/users.js'

// variables globales
const app = express()
// middlewares
app.use(json())
app.use(corsMiddleware())
app.disable('x-powered-by')

// rutas
app.use('/api/habits', habitsRouter)
app.use('/api/calendar', calendarRouter)
app.use('/api/diary', diaryRouter)
app.use('/api/instructions', instructionsRouter)
app.use('/api/users', usersRouter)
// para aquellas páginas que no existan.
app.use((req, res) => {
  res.status(404).send('<h1>404 error</h1>')
})

export default app
