import passport from 'passport'
import jwt from 'jsonwebtoken'
import logger from '../logger.js'

async function login (req, res, next) {
  passport.authenticate('local', (err, user, info) => {
    logger.debug('Login request')
    if (err) {
      logger.error('Error in /login ' + err)
      return next(err)
    }
    if (!user) {
      logger.warn('User not found in /login')
      return res.status(401).json({ success: false, message: info.message })
    }
    // TODO: aprovechar este payload para cargar más cosas del usuario
    const payload = { id: user.id }
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' })

    logger.info(`User logged in successfully: ${user.id}`)
    return res.json({ success: true, message: 'Login exitoso', token })
  })(req, res, next)
}

async function status (req, res) {
  logger.debug('Status check request')
  const token = req.headers.authorization?.split(' ')[1]
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          logger.error('Token has expired')
          return res.status(401).json({ isLoggedIn: false, message: 'Token has expired' })
        }

        if (err.name === 'JsonWebTokenError') {
          logger.error('Token is invalid')
          return res.status(401).json({ isLoggedIn: false, message: 'Token is invalid' })
        }
        logger.error('Error verifying token in /status: ' + err)
        return res.status(403).json({ isLoggedIn: false, message: 'Failed to authenticate token' })
      }

      logger.info(`User status checked in /status: ${decoded.id}`)
      res.json({ isLoggedIn: true, user: decoded })
    })
  } else {
    logger.warn('No token found in headers in /status')
    res.status(401).json({ isLoggedIn: false })
  }
}

export function checkAdmin (req, res, next) {
  logger.debug('Admin check request')
  const token = req.headers.authorization?.split(' ')[1]
  if (token) {
    try {
      const user = jwt.verify(token, process.env.JWT_SECRET)
      if (user.username === 'admin') {
        logger.info(`Admin access granted: ${user.id}`)
        return next()
      }
      logger.warn(`Unauthorized access to admin: ${user.id}`)
      return res.status(403).json({ message: 'Unauthorized' })
    } catch {
      logger.warn('Error verifying token')
      return res.status(403).json({ message: 'Unauthorized' })
    }
  } else {
    logger.warn('No token found in headers')
    return res.status(403).json({ message: 'Unauthorized' })
  }
}

export default {
  login,
  status
}
