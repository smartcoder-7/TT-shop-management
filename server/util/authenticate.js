const { auth } = require('./firebase')

const IS_OFFLINE = process.env.IS_OFFLINE === "true"

const ADMIN = {
  "sXNTtawm7sME2ydcwBDoSin4TS92": true
}

const authenticate = fn => (req, res) => {
  if (IS_OFFLINE) {
    fn(req, res)
    return
  }

  const authHeader = req.header('Authorization')
  const idToken = authHeader.split('Bearer ')[1]

  auth.verifyIdToken(idToken)
    .then(decoded => {
      const authId = decoded.uid;
      req.body.authId = authId

      if (
        !ADMIN[authId] &&
        req.body.userId !== authId
      ) {
        res.status(401).send('Unauthorized')
        return
      }

      fn(req, res)
    }).catch(error => {
      res.status(401).send(`Could not authenticate: ${error.message}`)
    });
}

module.exports = authenticate
