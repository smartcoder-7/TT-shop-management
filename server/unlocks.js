const kisi = require('./util/kisi')
const typeFactory = require('./util/typeFactory')
const reservations = require('./reservations')
const { canUnlock } = require('../shared/canUnlock')
const locations = require('../locations')
const invites = require('./invites')


const factory = typeFactory('unlocks', {
  beforeCreate: async (data) => {
    const reservation = await reservations.get(data.reservationId)

    if (reservation.userId !== data.userId) {
      if (!data.inviteId) { throw { message: 'Access denied.' } }
      const match = await invites.get(data.inviteId)
      const hasInvite = match && match.invitedUser === data.userId
      if (!hasInvite) { throw { message: 'Invalid invite.' } }
    }

    if (!canUnlock(reservation)) {
      throw { message: 'Outside of reservation access window.' }
    }

    const otherUnlocks = await factory.search({
      rules: [
        ['reservationId', '==', data.reservationId],
        ['userId', '==', data.userId],
      ]
    })

    if (otherUnlocks.length >= 5) {
      throw { message: 'Too many unlock attempts.' }
    }

    const { locationId } = reservation
    const location = locations[locationId]

    await kisi.unlock({ lockId: location.lockId })

    return {
      ...data,
      locationId
    }
  },
  // afterGet: async (data) => {
  //   const reservation = await reservations.get(data.reservationId)
  //   return {
  //     ...data,
  //     reservation
  //   }
  // }
})

module.exports = factory