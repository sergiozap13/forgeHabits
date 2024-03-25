// archivo para arrancar toda la aplicación. Servidor, BBD...
import app from './app.js'
import dotenv from 'dotenv'

import { PORT } from './config.js'
import { habitsRouter } from './routes/habits.js'
import { calendarRouter } from './routes/calendar.js'
import { diaryRouter } from './routes/diary.js'
import { instructionsRouter } from './routes/instructions.js'
import { usersRouter } from './routes/users.js'

dotenv.config()
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

app.listen(PORT, () => {
  console.log(`server listening on http://localhost:${PORT}`)
})
