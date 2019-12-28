const { db } = require('../util/firebase')
const chargeReservations = require('../util/chargeReservations')

const HOURS_24 = 1000 * 60 * 60 * 24
const HOURS_48 = HOURS_24 * 2

const autochargeReservations = async () => {
  const maxTime = Date.now() + HOURS_48
  const retryThreshold = Date.now() - HOURS_24

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
      if (reservation.chargeExempt) return
      // TODO: Change this to lastNotified
      // if (reservation.lastCharged && reservation.lastCharged >= retryThreshold) return
      reservations.push(reservation.id)
    })
  } catch (err) {
    throw 'Failed to get reservations.'
  }

  const charged = await chargeReservations({ reservations })
  return charged
}

module.exports = autochargeReservations
