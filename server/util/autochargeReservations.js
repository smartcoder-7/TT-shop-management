const { db } = require('./firebase')
const chargeReservations = require('./chargeReservations')

const MIN_10 = 1000 * 60 * 10

const autochargeReservations = async () => {
  const timeout = setTimeout(() => { throw 'Request timed out.' }, 10000)
  const maxTime = Date.now() + MIN_10

  const reservations = []

  // Get location, and check availability.
  try {
    const result = await db.collection('reservations')
      .where('reservationTime', '<=', maxTime)
      .get()

    const docs = result.docs || []

    docs.forEach(doc => {
      const reservation = doc.data()
      if (reservation.chargeId) return
      if (reservation.canceled) return
      // TODO: Change this to lastNotified
      // if (reservation.lastCharged && reservation.lastCharged >= retryThreshold) return
      reservations.push(reservation)
    })
  } catch (err) {
    throw 'Failed to get reservations.'
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
