import parseSessionId from 'util/parseSessionId'
import locations from '../../locations.json'

const getSessionRate = (sessionId) => {
  const { time, locationId } = parseSessionId(sessionId)
  const { timezone, defaultRate, specialRates } = locations[locationId]
  const dateObj = new Date(`00:00 ${timezone}`)
  dateObj.setTime(time)

  const day = dateObj.getDay()
  const hours = dateObj.getHours()

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

export default getSessionRate