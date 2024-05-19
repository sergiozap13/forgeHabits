import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

// Obtener la ruta del archivo actual
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const getProfileImage = (req, res) => {
  const userId = req.params.userId
  const imagePath = path.resolve(__dirname, '../../uploads/profileImages', `${userId}.png`)
  console.log(imagePath)
  if (fs.existsSync(imagePath)) {
    res.sendFile(imagePath)
  } else {
    res.status(404).send('Image not found')
  }
}

export default { getProfileImage }
