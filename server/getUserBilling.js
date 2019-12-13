const { db } = require('./util/firebase')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const getUserBilling = async (req, res) => {
  const {
    userId,
  } = req.body

  const userRef = db.collection('users').doc(userId)
  const user = await userRef.get()

  if (!user.exists || !user.data().stripeId) {
    res.status(200).json({})
    return
  }

  try {
    const customer = await stripe.customers.retrieve(user.data().stripeId)

    res.status(200).json(customer)
  } catch (err) {
    res.status(500).send(err.message)
  }
}

module.exports = getUserBilling