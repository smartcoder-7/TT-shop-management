import React, { useState, useEffect } from "react"
import { INTERVAL_MS, formatTime } from "util/getPodSessions"
import getDateParts from "util/getDateParts"

const formatInfo = reservation => {
  const date = new Date(reservation.reservationTime)
  const {
    dayOfTheWeek,
    month,
    day,
    hours,
    minutes
  } = getDateParts(date)

  return `${dayOfTheWeek}, ${month} ${day} ${formatTime(date.getTime())}`
}

const isActiveRange = r =>
  r[r.length - 1].reservationTime >= Date.now() - INTERVAL_MS

const ReservationRange = ({
  reservations
}) => {
  const first = reservations[0]
  const last = reservations[reservations.length - 1]

  return (
    <div>
      {formatInfo(first)} - {formatInfo(last)}
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
