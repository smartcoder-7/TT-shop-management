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
  const { reservations, numTables, timezone } = doc.data()
  
  const dateObj = new Date(`${date} 00:00 ${timezone}`)
  const dateId = formatDate(dateObj)
  const allTimes = getAllTimes()
  const reservationsOnDate = reservations[dateId] || {}

  return allTimes
  .map(time => {
    const now = new Date()
    const exactTime = new Date(`${date} ${time} ${timezone}`)

    const reservationsAtTime = reservationsOnDate[time] || {}
    const bookedTables = Object.keys(reservationsAtTime) || []

    const isAvailable = (
      exactTime.getTime() > now.getTime() &&
      bookedTables.length < numTables
    )

    return { 
      id: `${locationId}-${dateId}-${time}`,
      time,
      isAvailable,
    }
  })
}

export const parseSession = (str = '') => {
  const parts = str.split('-')
  const year = parts[1]
  const month = parts[2]
  const day = parts[3]

  const date = `${year}-${month}-${day}`

  return {
    locationId: parts[0],
    year,
    month,
    day,
    date,
    time: parts[4]
  }
}