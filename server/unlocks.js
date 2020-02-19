const { db } = require('./util/firebase')
const stripe = require('./util/stripe')
const typeFactory = require('./util/typeFactory')
const reservations = require('./reservations')

const factory = typeFactory('invites', {
  beforeCreate: async (data) => {
    return {
      ...data,
      timestamp: Date.now()
    }
  },
  afterGet: async (data) => {
    const reservation = await reservations.get(data.reservationId)
    return {
      ...data,
      reservation
    }
  }
})

module.exports = factory