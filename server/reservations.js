const { db } = require('./util/firebase')
const stripe = require('./util/stripe')
const typeFactory = require('./util/typeFactory')

const factory = typeFactory('reservations', {
  // beforeCreate: async (data) => {
  //   return {
  //     ...data,
  //     timestamp: Date.now()
  //   }
  // },
})

module.exports = factory