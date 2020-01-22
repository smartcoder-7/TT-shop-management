const { auth } = require('./firebase')

const IS_OFFLINE = process.env.IS_OFFLINE === "true"

const ADMIN = {
  // PRODUCTION
  // christine@pingpod.com
  "DQHRIz3l7ShkLVEMvAVQxyBjw9Z2": true,
  // max@pingpod.com
  "Q63QHeYrxUbRfMp4znqEDFosPJn2": true,
  // ernesto@pingpod.com
  "RmObH5fZlheisbCxni7FnJbhxUi2": true,
  // david@pingpod.com
  "uwiOkNc361bwpDX1oZxPI5L3kCR2": true,

  // STAGING
  // christine@pingpod.com
  "tCzV4p0SRMV9jIoRNv4sF4EdWRZ2": true
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

    if (
      !ADMIN[authId] &&
      req.body.userId !== authId
    ) {
      res.status(401).send('Unauthorized')
      return
    }

    await fn(req, res, next)
  } catch (error) {
    res.status(401).send(`Could not authenticate: ${error.message}`)
  }
}

module.exports = authenticate
