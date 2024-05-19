export const authorizeImageAccess = (req, res, next) => {
  const userId = req.user.id
  const imageUserId = req.params.userId
  if (userId !== imageUserId) {
    return res.status(403).send('Forbidden: You do not have access to this resource')
  }
  next()
}
