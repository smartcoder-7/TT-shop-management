import firebase from 'firebase/app'
import uuid from 'uuid'

import { parseSession } from 'util/getPodSessions'

const db = firebase.firestore()

const makeReservations = ({ 
  sessionIds = [], 
  userId, 
  onUnavailable = () => {} 
}) => {
  const batch = db.batch()

  const promises = sessionIds.map(sessionId => {
    const {
      date,
      time,
      locationId,
    } = parseSession(sessionId)
  
    const reservationId = uuid()

    const locationRef = db.collection('pods').doc(locationId)
    const userRef = db.collection('users').doc(userId)
    const reservationRef = db.collection('reservations').doc(reservationId)

    const getLocationAndUser = () => Promise.all([
      locationRef.get(),
      userRef.get(),
    ]).then(([ locationDoc, userDoc ]) => {
      if (!locationDoc.exists) {
        throw `Invalid location id: [${locationId}]`
      }

      if (!userDoc.exists) {
        throw `Invalid user id: [${userId}]`
      }

      return { 
        location: locationDoc.data(),
        user: userDoc.data(),
      }
    })

    return getLocationAndUser()
    .then(({ location, user })=> {
      const { reservations, numTables, timezone } = location
      console.log(reservations)
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

      // Create reservation object
      batch.set(reservationRef, {
        userId,
        time,
        date,
        locationId,
      })

      // Add reservation id to a location
      const locationKey = `reservations.${date}.${time}`
      batch.update(locationRef, {
        [locationKey]: firebase.firestore.FieldValue.arrayUnion(reservationRef)
      })

      // Add reservation id to a user
      const userKey = `reservations.${date}.${time}`
      batch.update(userRef, {
        [userKey]: firebase.firestore.FieldValue.arrayUnion(reservationRef)
      })
    })
  })
  
  return new Promise((resolve, reject) => {
    Promise.all(promises)
    .then(() => {
      batch.commit()
      .then(resolve)
      .catch(reject)
    })
  })
}

export default makeReservations