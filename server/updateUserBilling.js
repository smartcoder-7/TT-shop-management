const db = require('./util/db')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const updateUserBilling = async (req, res) => {
  const { 
    userId,
    customerId,
    token, 
  } = req.body

  try {
    const card = await stripe.customers.createSource(
      customerId,
      {
        source: token.id
      },
    );

    const updatedCustomer = await stripe.customers.update(
      customerId,
      {
        'default_source': card.id
      }
    );

    const userRef = db.collection('users').doc(userId)
    await userRef.update({ hasActiveCard: true })

    res.status(200).json(updatedCustomer)
  } catch(err) {
    res.status(500).send(err.message)
  }
}

module.exports = updateUserBilling