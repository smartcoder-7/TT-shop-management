const { db } = require('./util/firebase')
const stripe = require('./util/stripe')

const createUser = async (req, res) => {
  const {
    userId,
    email,
  } = req.body
  console.log('Creating user...')

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

  userData.id = userId
  userData.email = email || ''
  userData.createdAt = userData.createdAt || Date.now()

  if (!userData.stripeId) {
    try {
      const customer = await stripe.customers.create({
        metadata: { userId },
      })
      userData.stripeId = customer.id
    } catch (err) {
      res.status(500).send(err.message)
    }
  }

  try {
    await userRef.update(userData)
    res.status(200).json(userData)
  } catch (err) {
    res.status(500).send('Cannot reach server.')
  }
}

module.exports = createUser
