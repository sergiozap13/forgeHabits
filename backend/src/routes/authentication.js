import express from 'express'
import passport from 'passport'

export const authRouter = express.Router()

// post que manda el usuario si se autentica
authRouter.post('/login', (req, res, next) => {
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
})

// borra la session y la cookie (se desloga)
authRouter.delete('/logout', (req, res) => {
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
})
