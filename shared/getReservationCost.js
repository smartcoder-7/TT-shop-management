const { utcToZonedTime, format } = require('date-fns-tz')
const locations = require('../locations')

const getReservationRate = ({ reservation }) => {
  const { locationId, reservationTime } = reservation
  const { timezone: timeZone, defaultRate, specialRates } = locations[locationId]
  const date = new Date(reservationTime)

  const day = parseInt(format(date, 'i'))
  const hours = parseInt(format(date, 'HH'))

  const matchingRate = (specialRates || []).find(rate => {
    const { ranges } = rate

    const match = ranges.find(({ days, from, to }) => {
      return (
        days.indexOf(day) > -1 &&
        hours >= from.hour &&
        hours < to.hour
      )
    })

    if (match) return rate
  })

  const rate = matchingRate || defaultRate

  return {
    ...rate,
    for: (user) => user.isMember ? rate.MEMBER : rate.NON_MEMBER
  }
}

module.exports = getReservationRate
