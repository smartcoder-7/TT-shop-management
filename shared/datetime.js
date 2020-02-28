const moment = require('moment-timezone')

const DEFAULT_TIMEZONE = 'America/New_York'
const with0 = n => n < 10 ? `0${n}` : `${n}`

const parseTime = (time, timeZone = DEFAULT_TIMEZONE) => {
  const date = new Date(time)
  const m = moment(date).tz(timeZone)

  let day = m.format('D')
  let dayOfTheWeek = m.format('dddd')
  let dayOfTheWeekAbbr = m.format('ddd')

  return {
    date,
    dayOfTheWeekNum: m.format('d'),
    dayOfTheWeek,
    dayOfTheWeekAbbr,
    month: m.format('MMMM'),
    monthAbbr: m.format('MMM'),
    day,
    year: m.format('yyyy'),
    hours: m.format('hh'),
    hours24: m.format('HH'),
    minutes: m.format('mm'),
    seconds: m.format('ss')
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

const formatDate = (time, timezone = DEFAULT_TIMEZONE) => {
  const { dayOfTheWeek, month, day } = parseTime(time, timezone)
  return `${dayOfTheWeek}, ${month} ${day}`
}

const formatTime = (time, timeZone = DEFAULT_TIMEZONE) => {
  const date = new Date(time)
  return moment(date).tz(timeZone).format('hh:mm a')
}

const getDayStartTime = (time, timezone = DEFAULT_TIMEZONE) => {
  const t = moment(time)
    .tz(timezone)
    .hours(0)
    .minutes(0)
    .seconds(0)
    .milliseconds(0)
    .format('x')
  return parseInt(t)
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