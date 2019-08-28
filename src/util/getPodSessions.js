export const INTERVAL_MS = 1000 * 60 * 30

const with0 = n => n < 10 ? `0${n}` : `${n}`

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

const getAllTimes = (date) => {
  date.setHours(0)
  date.setMinutes(0)

  const times = []
  const beginningOfDay = date.getTime()

  date.setDate(date.getDate() + 1) 
  const endOfDay = date.getTime()

  let lastTime = beginningOfDay

  while (lastTime < endOfDay) {
    times.push(lastTime)
    lastTime += INTERVAL_MS
  }

  return times
}

export const formatDate = (date) => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return `${year}-${with0(month)}-${with0(day)}`
}

export const getSessions = (doc, date, locationId) => {
  const { reservations, numTables, timezone } = doc.data()
  
  const dateObj = new Date(`${date} 00:00 ${timezone}`)
  const dateId = formatDate(dateObj)
  const allTimes = getAllTimes(dateObj)
  const reservationsOnDate = reservations[dateId] || {}

  return allTimes
  .map(time => {
    const now = new Date()
    const reservationsAtTime = reservationsOnDate[time] || []

    const isAvailable = (
      time > now.getTime() &&
      reservationsAtTime.length < numTables
    )

    return { 
      id: `${locationId}-${time}`,
      time,
      isAvailable,
    }
  })
}

export const parseSession = (str = '') => {
  const parts = str.split('-')
  const time = parseInt(parts[1])

  const date = new Date(time)
  const timeEnd = time + INTERVAL_MS

  return {
    locationId: parts[0],
    date: formatDate(date),
    time,
    timeEnd,
    timeFormatted: formatTime(time),
    timeEndFormatted: formatTime(timeEnd),
  }
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

export const getDateParts = (date) => {
  const dayOfTheWeek = DAYS_OF_THE_WEEK[date.getDay()]
  const month = MONTHS[date.getMonth()]
  const day = date.getDate()
  const year = date.getFullYear()

  return {
    dayOfTheWeek,
    month,
    day,
    year
  }
}