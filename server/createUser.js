const { db } = require('./util/firebase')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

const createUser = async (req, res) => {
  const {
    userId,
    email,
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

  userData.id = userId
  userData.email = email || ''
  userData.createdAt = userData.createdAt || Date.now()

  if (!userData.stripeId) {
    const customer = await stripe.customers.create({
      metadata: { userId },
    })

    userData.stripeId = customer.id
  }

  await userRef.set(userData)
  res.status(200).json(userData)
}

module.exports = createUser
