const uuid = require('uuid')
const AvailabilityCheck = require('./util/AvailiabilityCheck')
const { db } = require('./util/firebase')
const locations = require('../locations.json')
const autochargeReservations = require('./jobs/autochargeReservations')

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
      return reject({ message: 'Invalid location.' })
    }

    const check = new AvailabilityCheck({
      userId,
      locationId,
      startTime: reservationTime
    })
    await check.run()

    if (check.isAlreadyBookedAt(reservationTime)) {
      return reject({
        message: 'Oops! You already booked a table during one of these sessions. Try again?'
      })
    }

    const isAvailable = () => {
      if (isPremium) return check.premiumTablesLeftAt(reservationTime) > 0
      return check.regularTablesLeftAt(reservationTime) > 0
    }

    if (!isAvailable()) {
      reject({
        message: `Some of these sessions are no longer available. Try again?`
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


    const reservationIds = []
    validReservations.forEach(reservation => {
      const reservationRef = db.collection('reservations').doc(reservation.id)
      reservationIds.push(reservation.id)
      batch.set(reservationRef, reservation)
    })

    const orderId = uuid()
    const orderRef = db.collection('orders').doc(orderId)
    batch.set(orderRef, {
      userId,
      reservations: reservationIds,
      createdAt: Date.now()
    })

    await batch.commit()
    autochargeReservations()

    res.status(200).json({
      success: true,
      reservations: validReservations,
      orderId
    })
  } catch (err) {
    res.status(500).send(err.message)
  }
}

module.exports = createReservations
