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

const ReservationRange = ({
  reservations
}) => {
  const firstSessionId = getSessionId(reservations[0])
  const lastSessionId = getSessionId(reservations[reservations.length - 1])

  const first = parseSessionId(firstSessionId)
  const last = parseSessionId(lastSessionId)

  return (
    <div className={styles.reservation}>
      <label>
        {first.formattedDate}
      </label>
      <p className={styles.date}>
        {first.formattedTime} - {last.formattedEndTime}
      </p>
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

  return (
    <div>
      {ranges.map((range, i) => (
        <ReservationRange reservations={range} key={i} />
      ))}
    </div>
  )
}

export default Reservations