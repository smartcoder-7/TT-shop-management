import { formatDate } from './date'

const parseSessionId = (str = '') => {
  const parts = str.split('-')
  const locationId = parts[0]
  const reservationTime = parseInt(parts[1])

  const date = new Date(reservationTime)
  const timeEnd = time + INTERVAL_MS

  return {
    locationId,
    date,
    formattedDate: formatDate(date),
    time,
    timeEnd,
    timeFormatted: formatTime(time),
    timeEndFormatted: formatTime(timeEnd),
  }
}

export default parseSessionId