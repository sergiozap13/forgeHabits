// archivo con el servidor
import express, { json } from 'express'
import passport from 'passport'
import { initialize as initializePassport } from './middlewares/passport-config.js'
import session from 'express-session'
import { corsMiddleware } from './middlewares/cors.js'
import { habitsRouter } from './routes/habits.js'
import { calendarRouter } from './routes/calendar.js'
import { diaryRouter } from './routes/diary.js'
import { instructionsRouter } from './routes/instructions.js'
import { usersRouter } from './routes/users.js'
import usersController from './controllers/usersController.js'
import { authRouter } from './routes/authentication.js'

initializePassport(
  passport,
  email => usersController.findUserByEmail(email),
  id => usersController.findUserById(id)
)

// variables globales
const app = express()
// middlewares
app.use(json())
app.use(corsMiddleware())
app.disable('x-powered-by')

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 3600000, // esto es una hora
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // si el entorno es de producción, entonces manda la cookie por https
    sameSite: 'strict'
  }
}))

app.use(passport.initialize())
app.use(passport.session())

// rutas
app.use('/api/habits', habitsRouter)
app.use('/api/calendar', calendarRouter)
app.use('/api/diary', diaryRouter)
app.use('/api/instructions', instructionsRouter)
app.use('/api/users', usersRouter)
app.use('/api/auth', authRouter)
// para aquellas páginas que no existan.
app.use((req, res) => {
  res.status(404).send('<h1>404 error</h1>')
})

export default app
