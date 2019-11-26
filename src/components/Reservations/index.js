import React, { useState, useEffect } from "react"
import { INTERVAL_MS, formatTime } from "util/getPodSessions"
import parseSessionId from 'util/parseSessionId'
import getDateParts from "util/getDateParts"
import styles from './styles.scss'

const formatInfo = reservation => {
  const sessionId = `0-${reservation.reservationTime}`
  const { formattedDate, formattedTime } = parseSessionId(sessionId)

  return `${formattedDate} ${formattedTime}`
}

const getSessionId = ({ reservationTime, locationId = '0' }) => (
  `${locationId}-${reservationTime}`
)

const isActiveRange = r =>
  r[r.length - 1].reservationTime >= Date.now() - INTERVAL_MS

const ReservationRange = ({
  reservations
}) => {
  const firstSessionId = getSessionId(reservations[0])
  const lastSessionId = getSessionId(reservations[reservations.length - 1])

  const first = parseSessionId(firstSessionId)
  const last = parseSessionId(lastSessionId)

  return (
    <div>
      {first.formattedDate}: {first.formattedTime} - {last.formattedEndTime}
    </div>
  )
}

const Reservations = ({
  reservations
}) => {
  const sortedReservations = reservations.sort((a, b) => {
    return a.reservationTime > b.reservationTime ? 1 : -1
  })

  const ranges = []

  sortedReservations.forEach((res, i) => {
    const prevRes = sortedReservations[i - 1]
    const isContiguous =
      prevRes && res.reservationTime <= prevRes.reservationTime + INTERVAL_MS

    if (isContiguous) {
      ranges[ranges.length - 1].push(res)
      return
    }

    ranges.push([res])
  })

  const activeRanges = ranges.filter(isActiveRange)
  const pastRanges = ranges.filter(r => !isActiveRange(r)).reverse()

  console.log("res", sortedReservations, ranges)

  return (
    <div>
      <h3>Upcoming Reservations</h3>
      {activeRanges.map((range, i) => (
        <ReservationRange reservations={range} key={i} />
      ))}

      <br />

      <h3>Past Reservations</h3>
      {pastRanges.map((range, i) => (
        <ReservationRange reservations={range} key={i} />
      ))}
    </div>
  )
}

export default Reservations
