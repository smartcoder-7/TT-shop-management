const db = require('./util/db')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const createUser = async (req, res) => {
  const {
    userId,
    email,
  } = req.body

  const userRef = db.collection('users').doc(userId)
  const user = await userRef.get()

  let userData = {}

  if (user.exists) {
    userData = user.data()
  }

  userData.id = userId
  userData.email = email || ''
  userData.createdAt = userData.createdAt || Date.now()

  if (!userData.stripeId) {
    const customer = await stripe.customers.create({
      metadata: {
        userId
      },
    })

    userData.stripeId = customer.id
  }

  await userRef.set(userData)
  res.status(200).json(userData)
}

module.exports = createUser