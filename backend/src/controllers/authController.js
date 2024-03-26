import passport from 'passport'

async function login (req, res, next) {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err)
    }
    if (!user) {
      return res.status(401).json({ success: false, message: info.message })
    }
    req.logIn(user, (loginErr) => {
      if (loginErr) {
        return next(loginErr)
      }
      return res.json({ success: true, message: 'Login exitoso', user: { id: user.id, email: user.email } })
    })
  })(req, res, next)
}

async function logout (req, res) {
  if (req.sessionID) {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: 'Error al cerrar la sesión' })
      }
      res.clearCookie('connect.sid')
      res.json({ success: true, message: 'Sesión cerrada correctamente' })
    })
  } else {
    res.json({ success: true, message: 'No hay sesión abierta' })
  }
}

// metodo para usar en las demas rutas
export function checkAuthenticated (req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }

  res.status(401).json({ message: 'Unauthorized' })
}

export function checkAdmin (req, res, next) {
  if (req.isAuthenticated() && req.user.username === 'admin') {
    return next() // Permitir acceso si es admin
  }
  return res.status(403).json({ message: 'Unauthorized' })
}

export default {
  login,
  logout
}
