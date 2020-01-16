const { db } = require('../../server/util/firebase')
const locations = require('../locations')

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

const getAllSessions = async (req, res) => {
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
      return !isClosed
    })

    res.status(200).json({
      sessions: availableSessions
    })
  } catch (err) {
    res.status(500).send(`Failed to get reservations: ${err.message}`)
    return
  }
}

module.exports = getAllSessions