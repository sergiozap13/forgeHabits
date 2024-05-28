import swaggerAutogen from 'swagger-autogen'

const doc = {
  info: {
    title: 'ForgeHabits API',
    description: 'The API for the FOrgeHabits app'
  },
  host: 'localhost:3000',
  schemes: ['http']
}

const outputFile = './swagger-output.json'
const endpointsFiles = ['./src/app.js']

swaggerAutogen()(outputFile, endpointsFiles, doc).then(async () => {
  await import('./src/app.js')
})
