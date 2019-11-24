import getDateParts from 'util/getDateParts'
import RATES from 'util/sessionRates'

const getSessionPrice = ({
  time,
  timezone = 'GMT-0500',
}) => {
  const dateObj = new Date(`00:00 ${timezone}`)
  dateObj.setTime(time)

  const {
    dayOfTheWeek,
    hours,
  } = getDateParts(dateObj)

  const isWeekend = dayOfTheWeek === 'Sunday' || dayOfTheWeek === 'Saturday'

  let rate

  const isBefore = (n) => (
    hours < n
  )

  if (!isWeekend) {
    if (isBefore(7)) {
      rate = RATES.OFF_PEAK
    } else if (isBefore(11)) {
      rate = RATES.NORMAL
    } else if (isBefore(13)) {
      rate = RATES.PEAK
    } else if (isBefore(17)) {
      rate = RATES.NORMAL
    } else {
      rate = RATES.PEAK
    }
  }

  if (isWeekend) {
    if (isBefore(7)) {
      rate = RATES.OFF_PEAK
    } else if (isBefore(10)) {
      rate = RATES.NORMAL
    } else {
      rate = RATES.PEAK
    }
  }

  return rate
}

export default getSessionPrice