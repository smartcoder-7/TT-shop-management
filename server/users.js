const { db } = require('./util/firebase')
const stripe = require('./util/stripe')
const typeFactory = require('./util/typeFactory')

const factory = typeFactory('users', {
  beforeCreate: async (data) => {
    if (!data.id) throw { message: 'Missing user id.' }
    if (!data.email) throw { message: 'Missing user email.' }

    const userId = data.id

    try {
      const userRef = db.collection('users').doc(userId)
      const user = await userRef.get()

      const userData = {
        createdAt: Date.now(),
        ...(user.exists ? user.data() : {}),
        ...data,
      }

      if (!userData.stripeId) {
        const customer = await stripe.customers.create({
          metadata: { userId },
          email: userData.email,
        })
        userData.stripeId = customer.id
      } else {
        // For backwards compatibility.
        await stripe.customers.update(userData.stripeId, {
          metadata: { userId },
          email: userData.email,
        })
      }
      return userData

    } catch (err) {
      throw err
    }
  },
  beforeUpdate: async (_data) => {
    const data = _data

    if (!data.stripeToken) {
      return data
    }

    if (!data.stripeId) {
      throw 'Missing stripe id.'
    }

    try {
      const card = await stripe.customers.createSource(
        data.stripeId,
        { source: data.stripeToken },
      );

      await stripe.customers.update(
        data.stripeId,
        { 'default_source': card.id }
      );

      data.hasActiveCard = true
    } catch (err) {
      throw err
    }

    return data
  }
})

module.exports = factory