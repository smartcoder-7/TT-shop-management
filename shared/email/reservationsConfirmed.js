const getReservationRanges = require('../getReservationRanges')
const parseReservationRange = require('../parseReservationRange')

const domain = process.env.NODE_ENV === 'production' ? 'https://pingpod.com' : 'https://app-staging.pingpod.com'

const getReservationsConfirmed = ({ reservations, userId }) => {
  const ranges = getReservationRanges(reservations)
    .map(parseReservationRange)

  return {
    userId,
    data: {
      reservations: ranges,
      accountUrl: `${domain}/account`
    },
    "template_id": "d-de4f551f767e4e69aff5a1c70f19b89e"
  }
}

module.exports = getReservationsConfirmed