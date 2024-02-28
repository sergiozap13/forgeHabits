// archivo para arrancar toda la aplicación. Servidor, BBD...
import app from './app.js'
import dotenv from 'dotenv'

import { PORT } from './config.js'
import { habitsRouter } from './routes/habits.js'

dotenv.config()
// rutas
app.use('/api/habits', habitsRouter)

// para aquellas páginas que no existan.
app.use((req, res) => {
  res.status(404).send('<h1>404 error</h1>')
})

app.listen(PORT, () => {
  console.log(`server listening on http://localhost:${PORT}`)
})
