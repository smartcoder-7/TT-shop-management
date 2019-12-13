const { db } = require('./util/firebase')
const locations = require('../locations.json')

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

  const location = locations[locationId]

  if (!location) {
    res.status(500).send(`No such location id: ${locationId}.`)
    return
  }

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

    const checkClosed = (time) => {
      // Always open?
      if (!location.closedFrom || !location.closedUntil) return false

      const date = new Date(time)

      const hour = date.getHours()
      const minute = date.getMinutes()

      return (
        (hour > location.closedFrom.hour || (
          hour === location.closedFrom.hour &&
          minute >= location.closedFrom.minute
        )) &&
        (hour < location.closedUntil.hour || (
          hour === location.closedUntil.hour &&
          minute < location.closedUntil.minute
        ))
      )
    }

    const availableSessions = sessions.filter(time => {
      const isClosed = checkClosed(time)
      const isFullyBooked = bookings[time] >= location.tables.length
      return !isClosed && !isFullyBooked
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