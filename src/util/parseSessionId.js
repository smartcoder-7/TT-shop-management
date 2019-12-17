import { formatDate, formatTime } from './datetime'
import * as constants from './constants'
import locations from '../../locations.json'

const parseSessionId = (str = '') => {
  const parts = str.split('-')
  const locationId = parts[0]
  const location = locations[locationId]
  const reservationTime = parseInt(parts[1])

  const date = new Date(reservationTime)
  const startTime = date.getTime()
  const endTime = reservationTime + constants.INTERVAL_MS

  return {
    full: str,
    locationId,
    date,
    formattedDate: formatDate(startTime, location.timezone),
    time: reservationTime,
    endTime,
    formattedTime: formatTime(reservationTime, location.timezone),
    formattedEndTime: formatTime(endTime, location.timezone),
  }
}

export default parseSessionId
