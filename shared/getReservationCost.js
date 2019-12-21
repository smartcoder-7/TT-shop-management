const { utcToZonedTime, format } = require('date-fns-tz')
const locations = require('../locations.json')

const getReservationCost = ({ locationId, reservationTime }) => {
  const { timezone: timeZone, defaultRate, specialRates } = locations[locationId]
  const _date = new Date(reservationTime)
  const date = utcToZonedTime(_date, timeZone)

  const day = format(date, 'd', { timeZone })
  const hours = format(date, 'HH', { timeZone })

  const matchingRate = specialRates.find(rate => {
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

  return matchingRate || defaultRate
}

module.exports = getReservationCost
