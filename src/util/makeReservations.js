import firebase from 'firebase/app'
import uuid from 'uuid'

import { parseSession } from 'util/getPodSessions'
import { generateNumericCode } from './generateCode'
import { getAccessCode, getPod, getUser } from 'util/db'

const db = firebase.firestore()

export const validateReservations = ({ 
  sessionIds = [], 
  userId, 
  onUnavailable = () => {} 
}) => {
  const promises = sessionIds.map(sessionId => {
    const {
      date,
      time,
      locationId,
    } = parseSession(sessionId)
  
    return Promise.all([
      getPod(locationId),
      getUser(userId),
    ])
    .catch(err => {
      onUnavailable(sessionId)
      throw err
    })
    .then(([ location, user ])=> {
      if (!location) {
        onUnavailable(sessionId)
        throw `Invalid pod id: [${locationId}]`
      }

      if (!user) {
        onUnavailable(sessionId)
        throw `Invalid user id: [${userId}]`
      }

      const { numTables, timezone } = location
      const reservations = location.reservations || {}
      const reservationsAtDate = reservations[date] || {}
      const reservationsAtTime = reservationsAtDate[time] || {}

      const now = new Date()
      const sessionTime = new Date(`${date} ${time} ${timezone}`)
      
      if (sessionTime.getTime() < now.getTime()) {
        onUnavailable(sessionId)
        throw "Looks like some of your selections are out of date. Try again?"
      }

      if (Object.keys(reservationsAtTime).length >= numTables) {
        onUnavailable(sessionId)
        throw "Darn! Looks like some of your selections got booked up. Try again?"
      }
    })
  })
  
  return Promise.all(promises)
}

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
    const accessCodeRef = db.collection('accessCodes').doc(sessionId)

    return Promise.all([
      getPod(locationId),
      getUser(userId),
      getAccessCode(sessionId)
    ])
    .catch(err => {
      onUnavailable(sessionId)
      throw err
    })
    .then(([ location, user, accessCode ])=> {
      if (!location) {
        onUnavailable(sessionId)
        throw `Invalid pod id: [${locationId}]`
      }

      if (!user) {
        onUnavailable(sessionId)
        throw `Invalid user id: [${userId}]`
      }

      const { numTables, timezone } = location
      const reservations = location.reservations || {}
      const reservationsAtDate = reservations[date] || {}
      const reservationsAtTime = reservationsAtDate[time] || {}

      const now = new Date()
      const sessionTime = new Date(`${date} ${time} ${timezone}`)
      if (sessionTime.getTime() < now.getTime()) {
        onUnavailable(sessionId)
        throw "Looks like some of your selections are out of date. Try again?"
      }

      if (Object.keys(reservationsAtTime).length >= numTables) {
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

      // If this is the first reservation for this time, generate an access key.
      const newAccessCode = accessCode || { code: generateNumericCode(6), users: [] }
      newAccessCode.users.push(userId)
      batch.set(accessCodeRef, newAccessCode)

      // Add reservation id to a location
      const reservationKey = `reservations.${date}.${time}`

      batch.update(locationRef, {
        [reservationKey]: firebase.firestore.FieldValue.arrayUnion(reservationRef)
      })

      // Add reservation id to a user
      const userKey = `reservations.${locationId}.${date}.${time}`
      batch.update(userRef, {
        [userKey]: firebase.firestore.FieldValue.arrayUnion(reservationRef)
      })

      return reservationId
    })
  })
  
  return new Promise((resolve, reject) => {
    Promise.all(promises)
    .then((reservationIds) => {
      batch.commit()
      .then(() => resolve(reservationIds))
      .catch(reject)
    })
  })
}

export default makeReservations