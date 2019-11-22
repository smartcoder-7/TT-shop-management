const db = require('./util/db')

const createUser = async (req, res) => {
  const { 
    userId, 
    email,
  } = req.body

  const userRef = db.collection('users').doc(userId)
  const user = await userRef.get()

  if (user.exists) {
    res.status(200).json(user.data())
    return
  }

  const userData = {
    id: userId,
    email
  }

  await userRef.set(userData)
  res.status(200).json(userData)
}

module.exports = createUser