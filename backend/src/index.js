// archivo para arrancar toda la aplicación. Servidor, BBD...
import app from './app.js'
import dotenv from 'dotenv'

import { PORT } from './config.js'

dotenv.config()

app.listen(PORT, () => {
  console.log(`server listening on http://localhost:${PORT}`)
})
