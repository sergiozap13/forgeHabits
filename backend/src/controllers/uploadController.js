import logger from '../logger.js'

const uploadProfileImage = (req, res) => {
  logger.info('UC - uploadProfileImage')
  if (!req.file) {
    return res.status(400).send('No file uploaded.')
  }
  res.status(200).send({
    message: 'File uploaded successfully',
    fileUrl: `/uploads/profileImages/${req.file.filename}`
  })
}

export default { uploadProfileImage }
