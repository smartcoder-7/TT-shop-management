const locations = require('../locations')
const { parseTime } = require('../shared/datetime')

const getReservationRate = ({ reservation }) => {
  const { locationId, reservationTime } = reservation
  const { defaultRate, specialRates, timezone } = locations[locationId]

  const { hours24, dayOfTheWeekNum } = parseTime(reservationTime, timezone)

  const day = parseInt(dayOfTheWeekNum)
  const hours = parseInt(hours24)

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
