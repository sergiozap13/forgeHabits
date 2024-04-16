import passport from 'passport'
import jwt from 'jsonwebtoken'

async function login (req, res, next) {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err)
    }
    if (!user) {
      return res.status(401).json({ success: false, message: info.message })
    }
    // TODO: aprovechar este payload para cargar más cosas del usuario
    const payload = { id: user.id }
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' })
    return res.json({ success: true, message: 'Login exitoso', token })
  })(req, res, next)
}

async function status (req, res) {
  const token = req.headers.authorization?.split(' ')[1]
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
          return res.status(403).json({ isLoggedIn: false })
        }
      })

      res.json({ isLoggedIn: true, user: decoded })
    } catch (err) {
      res.status(500).json({ isLoggedIn: false })
    }
  } else {
    res.status(401).json({ isLoggedIn: false })
  }
}

// metodo para usar en las demas rutas
export function checkAuthenticated (req, res, next) {
  const token = req.headers.authorization?.split(' ')[1]
  if (token) {
    try {
      jwt.verify(token, process.env.JWT_SECRET)
      return next()
    } catch {
      res.status(401).json({ message: 'Unauthorized' })
    }
  } else {
    res.status(401).json({ message: 'Unauthorized' })
  }
}

export function checkAdmin (req, res, next) {
  const token = req.headers.authorization?.split(' ')[1]
  if (token) {
    try {
      const user = jwt.verify(token, process.env.JWT_SECRET)
      if (user.username === 'admin') {
        return next()
      }
      return res.status(403).json({ message: 'Unauthorized' })
    } catch {
      return res.status(403).json({ message: 'Unauthorized' })
    }
  } else {
    return res.status(403).json({ message: 'Unauthorized' })
  }
}

export default {
  login,
  status
}
