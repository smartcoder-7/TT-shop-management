const locations = require('../locations')
const moment = require('moment-timezone')
const { parseTime } = require('../shared/datetime')

const INTERVAL_MS = 1000 * 60 * 30

const flattenTime = (time) => {
  const newDate = new Date(time)
  newDate.setMinutes(0)
  newDate.setSeconds(0)
  newDate.setMilliseconds(0)
  return newDate.getTime()
}

const getAll = (startTime, endTime) => {
  const sessions = []
  const flatStart = flattenTime(startTime)
  const flatEnd = flattenTime(endTime)

  for (let i = flatStart; i <= flatEnd; i += INTERVAL_MS) {
    sessions.push(i)
  }

  return sessions
}

const getAllSessions = ({
  locationId,
  startTime,
  endTime = startTime + (1000 * 60 * 60 * 24 * 30)
}) => {
  const location = locations[locationId]

  if (!location) {
    throw Error(`No such location id: ${locationId}.`)
  }

  const sessions = getAll(startTime, endTime)

  const checkClosed = (time) => {
    // Always open?
    const { openStart, openDuration, timezone } = location
    if (!openStart || !openDuration) return false

    const m = moment(new Date(time)).tz(timezone)
    const mHours = m.hours()
    const mMinutes = m.minutes()

    let hoursSinceOpen = mHours - openStart.hours
    if (hoursSinceOpen < 0) hoursSinceOpen += 24
    let minsSinceOpen = mMinutes - openStart.minutes
    if (minsSinceOpen < 0) minsSinceOpen += 24

    if (hoursSinceOpen < openDuration.hours) return false
    if (hoursSinceOpen === openDuration.hours) {
      return minsSinceOpen >= openDuration.minutes
    }

    return true
  }

  const availableSessions = sessions.filter(time => {
    const isClosed = checkClosed(time)
    return !isClosed
  })

  return availableSessions
}

module.exports = getAllSessions
