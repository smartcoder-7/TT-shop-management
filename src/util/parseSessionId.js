import { formatDate, formatTime } from './datetime'
import constants from './constants'

const parseSessionId = (str = '') => {
  const parts = str.split('-')
  const locationId = parts[0]
  const reservationTime = parseInt(parts[1])

  const date = new Date(reservationTime)
  const endTime = reservationTime + constants.INTERVAL_MS

  return {
    locationId,
    date,
    formattedDate: formatDate(date),
    time: reservationTime,
    endTime,
    formattedTime: formatTime(reservationTime),
    formattedEndTime: formatTime(endTime),
  }
}

export default parseSessionId