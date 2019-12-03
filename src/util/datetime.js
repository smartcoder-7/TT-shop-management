const with0 = n => n < 10 ? `0${n}` : `${n}`

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

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
]

const MONTHS_ABBR = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec'
]

export const getDateParts = (_date) => {
  let date = _date

  if (!Number.isNaN(date)) {
    date = new Date(date)
  }

  const dayOfTheWeek = DAYS_OF_THE_WEEK[date.getDay()]
  const dayOfTheWeekAbbr = DAYS_OF_THE_WEEK_ABBR[date.getDay()]
  const month = MONTHS[date.getMonth()]
  const monthAbbr = MONTHS_ABBR[date.getMonth()]
  const day = date.getDate()
  const year = date.getFullYear()
  const hours = date.getHours()
  const minutes = date.getMinutes()

  return {
    dayOfTheWeek,
    dayOfTheWeekAbbr,
    month,
    monthAbbr,
    day,
    year,
    hours,
    minutes
  }
}

export const formatDate = (date) => {
  const { dayOfTheWeek, month, day } = getDateParts(date)
  return `${dayOfTheWeek}, ${month} ${day}`
}

// TODO: Deal with timezones!!
export const formatTime = (time) => {
  const date = new Date(time)
  const hour = date.getHours()
  const minutes = date.getMinutes()

  let hour12 = hour % 12
  hour12 = hour12 === 0 ? 12 : hour12
  const ampm = hour < 12 ? 'AM' : 'PM'
  return `${with0(hour12)}:${with0(minutes)} ${ampm}`
}
