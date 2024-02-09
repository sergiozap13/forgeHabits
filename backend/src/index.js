// archivo para arrancar toda la aplicación. Servidor, BBD...
import app from './app.js'

import { PORT } from './config.js'

// rutas
app.get('/api', (req, res) => {
  res.send('<h1>Funciona</h1>')
})

app.use((req, res) => {
  res.status(404).send('<h1>404 error</h1>')
})

app.listen(PORT, () => {
  console.log(`server listening on http://localhost:${PORT}`)
})
