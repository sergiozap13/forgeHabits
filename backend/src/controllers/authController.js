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
    const payload = { id: user.id, email: user.email }
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' })
    return res.json({ success: true, message: 'Login exitoso', token })
  })(req, res, next)
}

// TODO: eliminar servicio
// async function logout (req, res) {
//   if (req.sessionID) {
//     req.session.destroy((err) => {
//       if (err) {
//         return res.status(500).json({ error: 'Error al cerrar la sesión' })
//       }
//       res.clearCookie('connect.sid')
//       res.json({ success: true, message: 'Sesión cerrada correctamente' })
//     })
//   } else {
//     res.json({ success: true, message: 'No hay sesión abierta' })
//   }
// }

async function status (req, res) {
  const token = req.headers.authorization?.split(' ')[1]
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      res.json({ isLoggedIn: true, user: decoded })
    } catch (err) {
      res.json({ isLoggedIn: false })
    }
  } else {
    res.json({ isLoggedIn: false })
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
