import React, { useState, useEffect } from "react"
import { INTERVAL_MS } from 'util/constants'
import RateLabel from 'components/RateLabel'
import cartContainer from 'containers/cartContainer'
import parseSessionId from 'util/parseSessionId'
import styles from './styles.scss'

const getSessionId = ({ reservationTime, locationId = '0' }) => (
  `${locationId}-${reservationTime}`
)

const ReservationRange = ({
  showRemove,
  reservations
}) => {
  const firstSessionId = getSessionId(reservations[0])
  const lastSessionId = getSessionId(reservations[reservations.length - 1])

  const first = parseSessionId(firstSessionId)
  const last = parseSessionId(lastSessionId)

  const premium = reservations[0].isPremium
  const error = reservations[0].error

  const remove = () => {
    reservations.forEach(r => {
      const sessionId = getSessionId(r)
      cartContainer.removeItem(sessionId)
    })
  }

  return (
    <div className={styles.reservation} data-error={!!error}>
      {premium && <span className={styles.premiumLabel}>
        <RateLabel rate={{ displayName: 'Premium' }} />
      </span>}
      <label>
        {first.formattedDate}
      </label>
      <p className={styles.date}>
        {first.formattedTime} - {last.formattedEndTime}
      </p>
      {error && <p data-p3><strong>!!</strong> {error}</p>}

      {showRemove && <div className={styles.remove} onClick={remove}>✕</div>}
    </div>
  )
}

const Reservations = ({
  reservations,
  showRemove = false
}) => {
  const sortedReservations = reservations.sort((a, b) => {
    return a.reservationTime > b.reservationTime ? 1 : -1
  })

  const ranges = []

  sortedReservations.forEach((res, i) => {
    const prevRes = sortedReservations[i - 1]
    const isContiguous =
      prevRes &&
      prevRes.error === res.error &&
      res.reservationTime <= prevRes.reservationTime + INTERVAL_MS &&
      prevRes.isPremium === res.isPremium

    if (isContiguous) {
      ranges[ranges.length - 1].push(res)
      return
    }

    ranges.push([res])
  })

  return (
    <div>
      {ranges.map((range, i) => (
        <ReservationRange reservations={range} showRemove={showRemove} key={i} />
      ))}
    </div>
  )
}

export default Reservations
