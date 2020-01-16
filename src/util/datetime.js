import { zonedTimeToUtc, utcToZonedTime, format } from 'date-fns-tz'
import set from 'date-fns/set'

const with0 = n => n < 10 ? `0${n}` : `${n}`

export const parseTime = (time, timeZone) => {
  const _date = new Date(time)
  const date = utcToZonedTime(_date, timeZone)

  return {
    dayOfTheWeek: format(date, 'EEEE', { timeZone }),
    dayOfTheWeekAbbr: format(date, 'EEE', { timeZone }),
    month: format(date, 'MMMM', { timeZone }),
    monthAbbr: format(date, 'MMM', { timeZone }),
    day: format(date, 'd', { timeZone }),
    year: format(date, 'yyyy', { timeZone }),
    hours: format(date, 'hh', { timeZone }),
    minutes: format(date, 'mm', { timeZone }),
    seconds: format(date, 'ss', { timeZone })
  }
}

export const formatDate = (time, timezone) => {
  const { dayOfTheWeek, month, day } = parseTime(time, timezone)
  return `${dayOfTheWeek}, ${month} ${day}`
}

export const formatTime = (time, timeZone) => {
  const date = new Date(time)
  const newDate = utcToZonedTime(date, timeZone)
  return format(newDate, 'hh:mm aa', { timeZone })
}

export const getDayStartTime = (time, timezone) => {
  const flattened = set(new Date(time), {
    hours: 0,
    minutes: 0,
    seconds: 0,
    milliseconds: 0
  })
  const newDate = zonedTimeToUtc(flattened, timezone)
  return newDate.getTime()
}

export const toNearestHour = (time) => {
  const newDate = new Date(time)
  newDate.setHours(0)
  newDate.setMinutes(0)
  newDate.setSeconds(0)
  newDate.setMilliseconds(0)
  return newDate.getTime()
}
