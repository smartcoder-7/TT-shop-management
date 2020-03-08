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

  const { userId, invites, inviteId, suggestedTableId } = reservations[0]
  const { locationId } = first
  const location = locations[locationId] || {}

  return {
    startTime: first.time,
    startTimeFormatted: first.formattedTime,
    endTime: last.endTime,
    endTimeFormatted: last.formattedEndTime,
    userId,
    tableId: suggestedTableId,
    location,
    invites,
    inviteId,
    date: first.formattedDate,
  }
}

module.exports = parseReservationRange