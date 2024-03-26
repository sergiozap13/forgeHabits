import { Strategy as LocalStrategy } from 'passport-local'
import bcrypt from 'bcrypt'

// metodo para inicializar el passportjs
export function initialize (passport, getUserByEmail, getUserById) {
  const authenticateUser = async (email, password, done) => {
    const user = await getUserByEmail(email)
    if (user == null) {
      return done(null, false, { message: 'No user with that email' })
    }

    try {
      if (await bcrypt.compare(password, user.password)) {
        return done(null, user)
      } else {
        return done(null, false, { message: 'Password incorrect' })
      }
    } catch (error) {
      return done(error)
    }
  }

  passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser))
  passport.serializeUser((user, done) => done(null, user.id))
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await getUserById(id)
      done(null, user)
    } catch (error) {
      done(error, null)
    }
  })
}

// metodo para usar en las demas rutas
export function checkAuthenticated (req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }

  res.status(401).json({ message: 'Unauthorized' })
}
