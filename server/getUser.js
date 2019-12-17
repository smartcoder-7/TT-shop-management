const { db } = require('./util/firebase')

const getUser = async (req, res) => {
  const {
    userId,
  } = req.body

  let userRef, user

  try {
    userRef = db.collection('users').doc(userId)
    user = await userRef.get()
  } catch (err) {
    res.status(500).send('Cannot reach server.')
  }

  let userData = {}

  if (user.exists) {
    userData = user.data()
  }

  res.status(200).json(userData)
}

module.exports = getUser
