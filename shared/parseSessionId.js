const { formatDate, parseTime, formatTime } = require('./datetime')
const constants = require('./constants')
const locations = require('../locations')

const parseSessionId = (str = '') => {
  const parts = str.split('/')
  const locationId = parts[0]
  const location = locations[locationId] || {}
  const reservationTime = parseInt(parts[1])

  const { date } = parseTime(reservationTime, location.timezone)
  const startTime = date.getTime()
  const endTime = reservationTime + constants.INTERVAL_MS

  return {
    full: str,
    locationId,
    date,
    formattedDate: formatDate(startTime, location.timezone),
    time: startTime,
    endTime,
    formattedTime: formatTime(reservationTime, location.timezone),
    formattedEndTime: formatTime(endTime, location.timezone),
  }
}

module.exports = parseSessionId
