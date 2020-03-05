const { formatDate, formatTime } = require('../datetime')
const { getReservationRanges } = require('../getReservationRanges')
const parseReservationRange = require('../parseReservationRange')
const origin = require('../getOrigin')

const getReservationsConfirmed = ({ reservations, userId }) => {
  const ranges = getReservationRanges(reservations)
    .map(r => {
      const { startTimeFormatted, endTimeFormatted, location, date, isPremium } = parseReservationRange(r)

      return {
        startTime: startTimeFormatted,
        endTime: endTimeFormatted,
        location: location.displayName,
        date,
        isPremium
      }
    })

  return {
    userId,
    data: {
      reservations: ranges,
      accountUrl: `${origin}/now`
    },
    "template_id": "d-de4f551f767e4e69aff5a1c70f19b89e"
  }
}

module.exports = getReservationsConfirmed