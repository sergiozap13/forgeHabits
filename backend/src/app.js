// archivo con el servidor
import express, { json } from 'express'
import { corsMiddleware } from './middlewares/cors.js'

// variables globales
const app = express()
// middlewares
app.use(json())
app.use(corsMiddleware())
app.disable('x-powered-by')

export default app
