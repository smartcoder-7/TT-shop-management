const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

const IS_OFFLINE = !!process.env.IS_OFFLINE

const mock = {
  customers: {
    retrieve: () => Promise.resolve({
      id: 'stripe12345',
      sources: {
        data: [
          { last4: '1234', brand: 'Visa' }
        ]
      }
    })
  }
}

module.exports = IS_OFFLINE ? mock : stripe
