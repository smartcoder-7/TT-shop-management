const { db } = require('./firebase')
const chargeReservations = require('./chargeReservations')
const _reservations = require('../reservations')

const MIN_10 = 1000 * 60 * 10

const autochargeReservations = async () => {
  const timeout = setTimeout(() => { throw 'Request timed out.' }, 20000)
  const maxTime = Date.now() + MIN_10

  // Get location, and check availability.
  try {
    const reservationsByUserId = {}
    let reservations = await _reservations.search({
      rules: [
        ['reservationTime', '<=', maxTime]
      ]
    })

    reservations = reservations.filter(reservation => {
      if (reservation.chargeId || reservation.canceled) return false

      reservationsByUserId[reservation.userId] = reservationsByUserId[reservation.userId] || []
      reservationsByUserId[reservation.userId].push(reservation)

      return true
    })

    if (!reservations.length) {
      console.log('No reservations to charge.')
      return []
    }

    console.log('Attempting to charge reservations', reservations)

    const charged = await chargeReservations({ reservations })
    clearTimeout(timeout)

    return charged
  } catch (err) {
    throw err.message
  }
}

module.exports = autochargeReservations
