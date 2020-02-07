const { db } = require('./util/firebase')
const applyInvites = require('./util/applyInvites')

const IS_OFFLINE = !!process.env.IS_OFFLINE

const getReservations = async (req, res) => {
  const {
    userId,
    locationId,
    reservationTime,
    startTime,
    withInvites = false,
    endTime
  } = req.body

  // Get location, and check availability.
  let query = db.collection('reservations')

  if (userId !== undefined) {
    query = query.where('userId', '==', userId)
  }

  if (locationId !== undefined) {
    query = query.where('locationId', '==', locationId)
  }

  if (reservationTime !== undefined) {
    query = query.where('reservationTime', '==', reservationTime)
  } else {
    if (startTime !== undefined) {
      query = query.where('reservationTime', '>=', startTime)
    }

    if (endTime !== undefined) {
      query = query.where('reservationTime', '<', endTime)
    }
  }

  if (IS_OFFLINE) {
    query = db.collection('reservations')
  }

  try {
    const result = await query.get()
    let reservations = []

    if (!result.docs) {
      res.status(200).json({
        reservations
      })
      return
    }

    reservations = result.docs.map(doc => doc.data())

    if (withInvites) {
      reservations = await Promise.all(reservations.map(applyInvites))
    }

    res.status(200).json({
      reservations
    })
  } catch (err) {
    res.status(500).send(err.message)
    return
  }
}

module.exports = getReservations
