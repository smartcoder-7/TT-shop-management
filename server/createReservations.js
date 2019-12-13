const uuid = require('uuid')
const { db } = require('./util/firebase')

const createReservation = async ({
  locationId,
  reservationTime,
  userId,
}) => {
  const locationRef = db.collection('locations').doc(locationId)
  const location = await locationRef.get()

  // If the location dodesn't exist, bail out.
  if (!location.exists || !location.data()) {
    return Promise.reject(`Location [${locationId}] not found.`)
  }

  const locationData = location.data()
  const { numTables } = locationData

  // Get location, and check availability.
  const availabilityCheck = await db.collection('reservations')
    .where('locationId', '==', locationId)
    .where('reservationTime', '==', reservationTime)
    .get()

  const otherReservations = availabilityCheck.docs

  // If unavailable, return 400.
  if (!otherReservations.empty && otherReservations.length >= numTables) {
    return Promise.reject(`No reservations available at location [${locationId}] at time [${reservationTime}].`)
  }

  // Create reservation document in database.
  const reservationId = uuid()
  const reservation = {
    id: reservationId,
    userId,
    locationId,
    reservationTime,
  }

  return Promise.resolve(reservation)
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
    )

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