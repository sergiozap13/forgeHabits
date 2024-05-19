import logger from '../logger.js'

const uploadProfileImage = (req, res) => {
  logger.info('UC - uploadProfileImage')
  if (!req.file) {
    return res.status(400).send('No file uploaded.')
  }

  const fileUrl = `${req.protocol}://${req.get('host')}/uploads/profileImages/${req.user.id}.png`

  res.status(200).send({
    message: 'File uploaded successfully',
    fileUrl
  })
}

export default { uploadProfileImage }
