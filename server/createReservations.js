const uuid = require('uuid')
const AvailabilityCheck = require('./util/AvailiabilityCheck')
const { db } = require('./util/firebase')
const locations = require('../locations.json')

const createReservation = ({
  locationId,
  reservationTime,
  userId,
  isPremium = false,
}) => {
  return new Promise(async (resolve, reject) => {
    const location = locations[locationId]

    // If the location dodesn't exist, bail out.
    if (!location) {
      return reject({ message: `Location [${locationId}] not found.` })
    }

    const check = new AvailabilityCheck({
      locationId,
      startTime: reservationTime
    })
    await check.run()

    const isAvailable = () => {
      if (isPremium) return check.premiumTablesLeftAt(reservationTime) > 0
      return check.anyTablesLeftAt(reservationTime) > 0
    }

    if (!isAvailable()) {
      reject({
        message: `Reservations at location [${locationId}] at time [${reservationTime}] are no longer available.`
      })
    }

    // Create reservation document in database.
    const reservationId = uuid()
    const reservation = {
      id: reservationId,
      userId,
      locationId,
      reservationTime,
      isPremium
    }

    resolve(reservation)
  })

}

const createReservations = async (req, res) => {
  const {
    userId,
    reservations = []
  } = req.body

  const batch = db.batch()

  try {
    const validReservations = await Promise.all(
      reservations.map(r => {
        return createReservation({ ...r, userId })
      })
    ).catch(err => {
      throw err
    })

    validReservations.forEach(reservation => {
      const reservationRef = db.collection('reservations').doc(reservation.id)
      batch.set(reservationRef, reservation)
    })

    await batch.commit()

    res.status(200).json({
      success: true,
      reservations: validReservations
    })
  } catch (err) {
    res.status(400).send(err.message)
  }
}

module.exports = createReservations
