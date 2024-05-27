import passport from 'passport'
import jwt from 'jsonwebtoken'
import logger from '../logger.js'
import habitsController from './habitsController.js'

async function login (req, res, next) {
  passport.authenticate('local', async (err, user, info) => {
    logger.debug('AC - /login request')
    if (err) {
      logger.error('AC - Error in /login ' + err)
      return next(err)
    }
    if (!user) {
      logger.warn('AC - User not found in /login')
      return res.status(401).json({ success: false, message: info.message })
    }

    try {
      await habitsController.checkHabitStreaks(user.id)
    } catch (e) {
      logger.error('AC - Error checking habit streaks: ' + e)
      return res.status(500).json({ success: false, message: 'Error checking habit streaks' })
    }

    // TODO: aprovechar este payload para cargar más cosas del usuario
    const payload = { id: user.id }
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' })

    logger.info(`AC - User logged in successfully: ${user.id}`)
    return res.json({ success: true, message: 'Login exitoso', token })
  })(req, res, next)
}

async function status (req, res) {
  logger.debug('AC - /status check request')
  const token = req.headers.authorization?.split(' ')[1]
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          logger.error('AC - Token has expired')
          return res.status(401).json({ isLoggedIn: false, message: 'Token has expired' })
        }

        if (err.name === 'JsonWebTokenError') {
          logger.error('AC - Token is invalid')
          return res.status(401).json({ isLoggedIn: false, message: 'Token is invalid' })
        }
        logger.error('AC - Error verifying token in /status: ' + err)
        return res.status(403).json({ isLoggedIn: false, message: 'Failed to authenticate token' })
      }

      logger.info(`AC - User status checked in /status: ${decoded.id}`)
      res.json({ isLoggedIn: true, user: decoded })
    })
  } else {
    logger.warn('AC - No token found in headers in /status')
    res.status(401).json({ isLoggedIn: false })
  }
}

export function checkAdmin (req, res, next) {
  logger.debug('AC - Admin check request')
  const token = req.headers.authorization?.split(' ')[1]
  if (token) {
    try {
      const user = jwt.verify(token, process.env.JWT_SECRET)
      if (user.username === 'admin') {
        logger.info(`AC - Admin access granted: ${user.id}`)
        return next()
      }
      logger.warn(`AC - Unauthorized access to admin: ${user.id}`)
      return res.status(403).json({ message: 'Unauthorized' })
    } catch {
      logger.warn('AC - Error verifying token')
      return res.status(403).json({ message: 'Unauthorized' })
    }
  } else {
    logger.warn('AC - No token found in headers')
    return res.status(403).json({ message: 'Unauthorized' })
  }
}

export default {
  login,
  status
}
