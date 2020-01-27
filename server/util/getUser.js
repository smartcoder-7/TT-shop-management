const { db } = require('./firebase')

const getUser = async ({ userId }) => {
  const userRef = db.collection('users').doc(userId)
  const userDoc = await userRef.get()

  if (!userDoc.exists) throw 'User does not exist.'
  return userDoc.data()
}

module.exports = getUser