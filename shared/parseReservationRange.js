const parseSessionId = require('./parseSessionId')
const locations = require('../locations')

const getSessionId = ({ reservationTime, locationId }) => (
  `${locationId}/${reservationTime}`
)

const parseReservationRange = reservations => {
  const firstSessionId = getSessionId(reservations[0])
  const lastSessionId = getSessionId(reservations[reservations.length - 1])

  const first = parseSessionId(firstSessionId)
  const last = parseSessionId(lastSessionId)

  const { locationId } = first
  const location = locations[locationId] || {}

  return {
    startTime: first.formattedTime,
    endTime: last.formattedEndTime,
    location: location.displayName,
    date: first.formattedDate,
    isPremium: !!reservations[0].isPremium
  }
}

module.exports = parseReservationRange