// archivo con el servidor
import express, { json } from 'express'
import passport from 'passport'
import { initialize as initializePassport } from './middlewares/passport-config.js'
import { corsMiddleware } from './middlewares/cors.js'
import { habitsRouter } from './routes/habits.js'
import { completesHabitsRouter } from './routes/completesHabits.js'
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

app.use(passport.initialize())

// rutas protegidas
app.use('/api/habits', passport.authenticate('jwt', { session: false }), habitsRouter)
app.use('/api/completions', passport.authenticate('jwt', { session: false }), completesHabitsRouter)
app.use('/api/diary', passport.authenticate('jwt', { session: false }), diaryRouter)
app.use('/api/instructions', passport.authenticate('jwt', { session: false }), instructionsRouter)
app.use('/api/users', usersRouter)
// rutas no protegidas
app.use('/api/auth', authRouter)
// para aquellas páginas que no existan.
app.use((req, res) => {
  res.status(404).send('<h1>404 error</h1>')
})

export default app
