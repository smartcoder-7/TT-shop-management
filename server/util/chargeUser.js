const stripe = require('./stripe')
const { db } = require('./firebase')

const chargeUser = async ({ userId, amount, description }) => {
  try {
    userRef = db.collection('users').doc(userId)
    const userDoc = await userRef.get()
    user = userDoc.data()
  } catch (err) {
    throw 'User does not exist.'
  }

  if (!user.stripeId) {
    throw 'User does not have an associated Stripe id.'
  }

  if (!user.hasActiveCard) {
    throw 'User does not have an active card.'
  }

  const stripeCustomer = await stripe.customers.retrieve(user.stripeId)

  if (!stripeCustomer) {
    userRef.update({ hasActiveCard: false, stripeId: null })
    throw 'Cannot find the user\'s associated Stripe account.'
  }

  if (!stripeCustomer.default_source) {
    userRef.update({ hasActiveCard: false })
    throw 'User does not have a default payment source in Stripe.'
  }

  try {
    const charge = await stripe.charges.create({
      amount,
      currency: 'usd',
      customer: stripeCustomer.id,
      source: stripeCustomer.default_source,
      description,
    });
    return charge
  } catch (err) {
    console.log('[Stripe Error]', err)
    throw err.message || err.type
  }
}

module.exports = chargeUser