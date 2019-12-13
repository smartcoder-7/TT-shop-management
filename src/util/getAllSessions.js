import locations from '../../locations.json'

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
  endTime
}) => {
  const location = locations[locationId]

  if (!location) {
    throw Error(`No such location id: ${locationId}.`)
  }

  const sessions = getAll(startTime, endTime)

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

  return {
    sessions: availableSessions
  }
}

export default getAllSessions