import winston from 'winston'

// Distintos niveles de logs
const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3
}

// Formato de logs
const logFormat = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss'
  }),
  winston.format.printf(info => `LOGGER - ${info.timestamp} ${info.level}: ${info.message}`)
)

// DESARROLLO -> en consola
const devTransports = [
  new winston.transports.Console({
    level: 'debug',
    format: winston.format.combine(
      winston.format.colorize(),
      logFormat
    )
  })
]

// PRODUCCIÓN -> en archivos
const prodTransports = [
  new winston.transports.File({ filename: 'error.log', level: 'error' }),
  new winston.transports.File({ filename: 'combined.log' })
]

// Crear el logger
const logger = winston.createLogger({
  levels: logLevels,
  format: logFormat,
  transports: process.env.ENVIRONMENT === 'development' ? devTransports : prodTransports
})

export default logger
