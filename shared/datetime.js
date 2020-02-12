const { zonedTimeToUtc, utcToZonedTime: _utcToZonedTime, format } = require('date-fns-tz')
const set = require('date-fns/set').default

const with0 = n => n < 10 ? `0${n}` : `${n}`

const utcToZonedTime = (d, opts) => {

  if (d.toString().indexOf('Eastern Standard Time')) return d
  if (d.toString().indexOf('Eastern Daylight Time')) return d
  return _utcToZonedTime(d, opts)
}

const DAYS_OF_THE_WEEK = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
]

const DAYS_OF_THE_WEEK_ABBR = [
  'Sun',
  'Mon',
  'Tue',
  'Wed',
  'Thu',
  'Fri',
  'Sat'
]

const parseTime = (time, timeZone) => {
  const _date = new Date(time)
  const date = utcToZonedTime(_date, timeZone)

  let day = format(date, 'd', { timeZone })
  let dayOfTheWeek = format(date, 'EEEE', { timeZone })
  let dayOfTheWeekAbbr = format(date, 'EEE', { timeZone })

  return {
    date,
    dayOfTheWeek,
    dayOfTheWeekAbbr,
    month: format(date, 'MMMM', { timeZone }),
    monthAbbr: format(date, 'MMM', { timeZone }),
    day,
    year: format(date, 'yyyy', { timeZone }),
    hours: format(date, 'hh', { timeZone }),
    minutes: format(date, 'mm', { timeZone }),
    seconds: format(date, 'ss', { timeZone })
  }
}

const formatDuration = (time) => {
  const seconds = Math.floor(time / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)

  const s = seconds - (minutes * 60)
  const m = minutes - (hours * 60)

  return `${with0(hours)}:${with0(m)}:${with0(s)}`
}

const formatDate = (time, timezone) => {
  const { dayOfTheWeek, month, day } = parseTime(time, timezone)
  return `${dayOfTheWeek}, ${month} ${day}`
}

const formatTime = (time, timeZone) => {
  const date = new Date(time)
  const newDate = utcToZonedTime(date, timeZone)
  return format(newDate, 'hh:mm aa', { timeZone })
}

const getDayStartTime = (time, timezone) => {
  const flattened = set(new Date(time), {
    hours: 0,
    minutes: 0,
    seconds: 0,
    milliseconds: 0
  })
  const newDate = zonedTimeToUtc(flattened, timezone)
  return newDate.getTime()
}

const toNearestHour = (time) => {
  const newDate = new Date(time)
  newDate.setHours(0)
  newDate.setMinutes(0)
  newDate.setSeconds(0)
  newDate.setMilliseconds(0)
  return newDate.getTime()
}

module.exports = {
  parseTime,
  formatDate,
  formatDuration,
  formatTime,
  getDayStartTime,
  toNearestHour
}