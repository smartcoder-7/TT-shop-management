const reservations = require('../reservations')
const billUser = require('./billUser')
const getBillingThreshold = require('./getBillingThreshold')

const autochargeReservations = async () => {
  try {
    let billableReservations = await reservations.search({
      rules: [
        ['reservationTime', '<=', getBillingThreshold()]
      ]
    })

    const userIds = {}

    billableReservations.forEach(reservation => {
      if (reservation.chargeId || reservation.canceled) return false
      userIds[reservation.userId] = true
    })

    const uniqueUserIds = Object.keys(userIds)

    if (!uniqueUserIds.length) {
      console.log('No reservations to charge.')
      return []
    }

    console.log('Attempting to charge users', uniqueUserIds)
    return await Promise.all(uniqueUserIds.map(userId => {
      return billUser({ userId })
    }))
  } catch (err) {
    throw err.message
  }
}

module.exports = autochargeReservations
