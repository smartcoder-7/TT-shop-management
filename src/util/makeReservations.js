import firebase from 'firebase/app'
import uuid from 'uuid'

import { parseSession } from 'util/getPodSessions'

const db = firebase.firestore()

const makeReservations = ({ sessionIds = [], userId, onUnavailable = () => {} }) => {
  const batch = db.batch()

  const promises = sessionIds.map(sessionId => {
    const {
      date,
      time,
      locationId,
    } = parseSession(sessionId)
  
    const reservationId = uuid()

    const ref = db.collection('pods').doc(locationId)

    return ref
    .get()
    .then(doc => {
      if (!doc.exists) {
        onUnavailable(sessionId)
        throw "Hmm, some of your reservations have invalid locations."
      }

      const { reservations, numTables, timezone } = doc.data()
      const reservationTimes = reservations[date] || {}
      const reservationsPerTime = reservationTimes[time] || {}

      const now = new Date()
      const sessionTime = new Date(`${date} ${time} ${timezone}`)
      if (sessionTime.getTime() < now.getTime()) {
        onUnavailable(sessionId)
        throw "Looks like some of your selections are out of date. Try again?"
      }

      if (Object.keys(reservationsPerTime).length >= numTables) {
        onUnavailable(sessionId)
        throw "Darn! Looks like some of your selections got booked up. Try again?"
      }

      const key = `reservations.${date}.${time}.${reservationId}`

      batch.update(ref, {
        [key]: {
          userId
        }
      })
    })
  })
  
  return Promise.all(promises)
  .then(() => {
    batch.commit()
  })
}

export default makeReservations