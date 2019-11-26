const db = require('./util/db')

const INTERVAL_MS = 1000 * 60 * 30

const flattenTime = (time) => {
  const newDate = new Date(time)
  newDate.setMinutes(0)
  newDate.setSeconds(0)
  newDate.setMilliseconds(0)
  return newDate.getTime()
}

const getAllSessions = (startTime, endTime) => {
  const sessions = []
  const flatStart = flattenTime(startTime)
  const flatEnd = flattenTime(endTime)

  for (let i = flatStart; i <= flatEnd; i += INTERVAL_MS) {
    sessions.push(i)
  }

  return sessions
}

const getAvailableSessions = async (req, res) => {
  const {
    locationId,
    startTime,
    endTime
  } = req.body

  const locationNode = await db.collection('locations').doc(locationId).get()

  if (!locationNode.exists) {
    res.status(500).send(`No such location id: ${locationId}.`)
    return
  }

  const location = locationNode.data()

  try {
    // Get location, and check availability.
    let query = db.collection('reservations')
      .where('locationId', '==', locationId)
      .where('reservationTime', '>=', startTime)
      .where('reservationTime', '<=', endTime)

    const result = await query.get()

    const bookings = {}

    if (result.docs) {
      result.docs.forEach(doc => {
        const time = doc.data().reservationTime
        bookings[time] = bookings[time] || 0
        bookings[time] += 1
      })
    }

    const sessions = getAllSessions(startTime, endTime)

    const availableSessions = sessions.filter(time => {
      const isFullyBooked = bookings[time] >= location.numTables
      return !isFullyBooked
    })

    res.status(200).json({
      sessions: availableSessions
    })
  } catch (err) {
    res.status(500).send(`Failed to get reservations: ${err.message}`)
    return
  }
}

module.exports = getAvailableSessions