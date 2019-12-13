import firebase from 'firebase/app'
import uuid from 'uuid'
import axios from 'axios'

import { parseSession } from 'util/getPodSessions'
import { generateNumericCode } from './generateCode'
import { getAccessCode, getPod, getUser } from 'util/db'

const db = firebase.firestore()

export const validateReservations = ({
  sessionIds = [],
  userId,
  onUnavailable = () => { }
}) => {
  const promises = sessionIds.map(sessionId => {
    const {
      date,
      time,
      locationId,
    } = parseSession(sessionId)

    return getPod(locationId)
      .catch(err => {
        onUnavailable(sessionId)
        throw err
      })
      .then((location) => {
        if (!location) {
          onUnavailable(sessionId)
          throw `Invalid pod id: [${locationId}]`
        }

        const { numTables, timezone } = location
        const reservations = location.reservations || {}
        const reservationsAtDate = reservations[date] || {}
        const reservationsAtTime = reservationsAtDate[time] || {}

        const now = new Date()
        const sessionTime = new Date(`${date} 00:00 ${timezone}`)
        sessionTime.setTime(time)

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
}) => {
  const reservations = sessionIds.map(sessionId => {
    const {
      time,
      locationId,
    } = parseSession(sessionId)

    return {
      reservationTime: time,
      locationId,
    }
  })

  return axios.post('/api/create-reservations', {
    userId,
    reservations
  })
}

export default makeReservations