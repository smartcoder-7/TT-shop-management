const { db } = require('./util/firebase')

const updateUserInfo = async (req, res) => {
  const {
    userId,
    firstName,
    lastName
  } = req.body

  try {
    const userRef = db.collection('users').doc(userId)
    const getUser = await userRef.get()

    if (!getUser.exists) res.status(500).send('Cannot find user.')

    const user = getUser.data()

    user.firstName = firstName || user.firstName
    user.lastName = lastName || user.lastName

    await userRef.update(user)
    res.status(200).json(user)
  } catch (err) {
    res.status(400).send(err.message)
  }
}

module.exports = updateUserInfo