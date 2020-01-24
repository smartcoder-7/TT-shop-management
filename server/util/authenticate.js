const { auth, db } = require('./firebase')

const IS_OFFLINE = process.env.IS_OFFLINE === "true"

const isAdmin = async (userId) => {
  const user = await db.collection('users').doc(userId).get()
  return user.exists && user.data() && user.data().isAdmin
}

const authenticate = fn => async (req, res, next) => {
  if (IS_OFFLINE) {
    await fn(req, res, next)
    return
  }

  const authHeader = req.header('Authorization')
  const idToken = authHeader.split('Bearer ')[1]

  try {
    const decoded = await auth.verifyIdToken(idToken)
    const authId = decoded.uid;

    if (req.body.userId !== authId) {
      const allow = await isAdmin(authId)

      if (!allow) {
        res.status(401).send('Unauthorized')
        return
      }
    }
  } catch (error) {
    res.status(401).send(`Could not authenticate: ${error.message}`)
  }

  try {
    await fn(req, res, next)
  } catch (error) {
    res.status(500).send(error.message)
  }
}

module.exports = authenticate
