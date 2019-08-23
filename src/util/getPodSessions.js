import firebase from 'firebase/app'

const DEFAULT_POD_ID = '0'

const db = firebase.firestore()

const with0 = n => n < 10 ? `0${n}` : `${n}`

const getAllTimes = () => {
  const times = []

  for (let i = 0; i < 24; i++) {
    const hour = with0(i)
    times.push(`${hour}:00`)
    times.push(`${hour}:30`)
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
  console.log(date)
  const dateObj = new Date(`${date} 00:00 GMT-0500`)
  const dateId = formatDate(dateObj)

  const allTimes = getAllTimes()

  const { reservations, numTables } = doc.data()
  const reservationsOnDate = reservations[dateId] || {}

  return allTimes
  .map(time => {
    const reservationsAtTime = reservationsOnDate[time] || {}
    const bookedTables = Object.keys(reservationsAtTime) || []
    const isAvailable = bookedTables.length < numTables
    return { 
      id: `${locationId}-${dateId}-${time}`,
      time,
      isAvailable,
    }
  })
}

export const parseSession = (str = '') => {
  const parts = str.split('-')

  return {
    locationId: parts[0],
    year: parts[1],
    month: parts[2],
    day: parts[3],
    time: parts[4]
  }
}