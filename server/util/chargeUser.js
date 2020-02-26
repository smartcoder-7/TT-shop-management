const stripe = require('./stripe')
const { db } = require('./firebase')
const slack = require('./slack')

const chargeUser = async ({ userId, amount, description }) => {
  let stripeCustomer

  if (Number.isNaN(amount) || amount < 50) {
    throw `${amount} is not a valid Stripe charge amount.`
  }

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

  try {
    stripeCustomer = await stripe.customers.retrieve(user.stripeId)
  } catch (err) {
    console.log('hello')
    throw err
  }

  if (!stripeCustomer) {
    userRef.update({ hasActiveCard: false, stripeId: null })
    throw 'Cannot find the user\'s associated Stripe account.'
  }

  if (!stripeCustomer.default_source) {
    userRef.update({ hasActiveCard: false })
    throw 'User does not have a default payment source in Stripe.'
  }

  try {
    const chargeData = {
      amount,
      currency: 'usd',
      customer: stripeCustomer.id,
      source: stripeCustomer.default_source,
      description,
    }

    console.log('[Processing Stripe Charge]', chargeData)
    const charge = await stripe.charges.create(chargeData);

    try {
      await slack.newCharge({ description, amount, user, stripeCustomer })
    } catch (err) {
      console.log(err)
    }

    return charge
  } catch (err) {
    await userRef.update({ hasActiveCard: false })
    console.log('[Stripe Error]', err)
    throw err.message || err.type
  }
}

module.exports = chargeUser
