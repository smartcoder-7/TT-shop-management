const { auth } = require('./firebase')

const authenticate = fn => (req, res) => {
  const authHeader = req.header('Authorization')
  const idToken = authHeader.split('Bearer ')[1]

  auth.verifyIdToken(idToken)
    .then(decoded => {
      const authId = decoded.uid;
      req.body.authId = authId

      if (req.body.userId !== authId) {
        res.status(401).send('Unauthorized')
        return
      }

      fn(req, res)
    }).catch(error => {
      res.status(401).send(`Could not authenticate: ${error.message}`)
    });
}

module.exports = authenticate