const _reservations = require('../reservations')
const billUser = require('./billUser')

const MIN_10 = 1000 * 60 * 10

const autochargeReservations = async () => {
  const maxTime = Date.now() + MIN_10

  // Get location, and check availability.
  try {
    let reservations = await _reservations.search({
      rules: [
        ['reservationTime', '<=', maxTime]
      ]
    })

    const userIds = {}

    reservations.forEach(reservation => {
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
