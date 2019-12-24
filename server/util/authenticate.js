const { auth } = require('./firebase')

const IS_OFFLINE = process.env.IS_OFFLINE === "true"

const ADMIN = {
  // itschristinecha+5@gmail.com
  "sXNTtawm7sME2ydcwBDoSin4TS92": true,
  // max@pingpod.com
  "Q63QHeYrxUbRfMp4znqEDFosPJn2": true,
  // maxkogler@gmail.com
  "Z7GutoomyCMYAdsjxoU72UC7BgH2": true,
  // ernesto@pingpod.com
  "RmObH5fZlheisbCxni7FnJbhxUi2": true,
  // david@pingpod.com
  "uwiOkNc361bwpDX1oZxPI5L3kCR2": true,
}

const authenticate = fn => async (req, res) => {
  if (IS_OFFLINE) {
    await fn(req, res)
    return
  }

  const authHeader = req.header('Authorization')
  const idToken = authHeader.split('Bearer ')[1]

  console.log('Authenticating...', idToken, auth)
  try {
    const decoded = await auth.verifyIdToken(idToken)
    const authId = decoded.uid;
    console.log('Decoded...', decoded)

    if (
      !ADMIN[authId] &&
      req.body.userId !== authId
    ) {
      console.log('UNAUTH!...')
      res.status(401).send('Unauthorized')
      return
    }

    console.log('...')
    await fn(req, res)
  } catch (error) {
    res.status(401).send(`Could not authenticate: ${error.message}`)
  }
}

module.exports = authenticate
