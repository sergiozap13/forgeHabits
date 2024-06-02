// archivo para arrancar toda la aplicación. Servidor, BBD...
import app from './app.js'
import dotenv from 'dotenv'
import { PORT } from './config.js'
import logger from './logger.js'

dotenv.config()

app.listen(PORT, () => {
  logger.debug(`server  listening on http://localhost:${PORT}`)
})
