const DAYS_OF_THE_WEEK = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
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

const getDateParts = (date) => {
  const dayOfTheWeek = DAYS_OF_THE_WEEK[date.getDay()]
  const month = MONTHS[date.getMonth()]
  const day = date.getDate()
  const year = date.getFullYear()
  const hours = date.getHours()
  const minutes = date.getMinutes()

  return {
    dayOfTheWeek,
    month,
    day,
    year,
    hours,
    minutes
  }
}

export default getDateParts