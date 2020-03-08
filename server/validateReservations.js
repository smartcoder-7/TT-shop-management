const AvailabilityCheck = require('./util/AvailiabilityCheck')
const locations = require('../locations')

const validateReservation = ({
  userId,
  locationId,
  reservationTime,
  isPremium = false,
}) => {
  return new Promise(async (resolve) => {
    const location = locations[locationId]

    // If the location dodesn't exist, bail out.
    if (!location) {
      return resolve({
        isAvailable: false,
        error: 'Invalid location.'
      })
    }

    const check = new AvailabilityCheck({
      locationId,
      userId,
      startTime: reservationTime
    })

    await check.run()

    if (check.isAlreadyBookedAt(reservationTime)) {
      return resolve({
        isAvailable: false,
        error: 'Already booked a table at this time.'
      })
    }

    const isAvailable = () => {
      return check.anyTablesLeftAt(reservationTime) > 0
    }

    if (!isAvailable()) {
      return resolve({
        isAvailable: false,
        error: `Session no longer available.`
      })
    }

    resolve({ isAvailable: true })
  })
}

const validateReservations = async (req, res) => {
  const {
    userId,
    reservations = []
  } = req.body

  const data = []

  const validations = await Promise.all(
    reservations.map(r => validateReservation({ ...r, userId }))
  )

  validations.forEach((val, i) => {
    const reservation = reservations[i]
    data.push({ ...reservation, ...val })
  })

  res.status(200).json({
    reservations: data,
  })
}

module.exports = validateReservations
