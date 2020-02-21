const { db } = require('./firebase')
const chargeReservations = require('./chargeReservations')
const reservations = require('../reservations')

const MIN_10 = 1000 * 60 * 10

const autochargeReservations = async () => {
  const timeout = setTimeout(() => { throw 'Request timed out.' }, 10000)
  const maxTime = Date.now() + MIN_10

  const reservations = []

  // Get location, and check availability.
  try {
    const result = await reservations.search({
      rules: [
        ['reservationTime', '<=', maxTime]
      ]
    })

    const docs = result.docs || []
    const reservationsByUserId = {}

    docs.forEach(doc => {
      const reservation = doc.data()
      if (reservation.chargeId) return
      if (reservation.canceled) return
      // TODO: Change this to lastNotified
      // if (reservation.lastCharged && reservation.lastCharged >= retryThreshold) return

      reservationsByUserId[reservation.userId] = reservationsByUserId[reservation.userId] || []
      reservationsByUserId[reservation.userId].push(reservation)

      reservations.push(reservation)
    })
  } catch (err) {
    throw err.message
  }

  console.log('Attempting to charge reservations', reservations)

  try {
    const charged = await chargeReservations({ reservations })
    clearTimeout(timeout)
    return charged
  } catch (err) {
    throw err.message
  }
}

module.exports = autochargeReservations
