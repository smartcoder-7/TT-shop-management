import React, { useState, useEffect } from "react"
import { INTERVAL_MS } from 'util/constants'
import classNames from 'classnames'
import { unlockDoor } from 'api';
import RateLabel from 'components/RateLabel'
import cartContainer from 'containers/cartContainer'
import parseSessionId from 'util/parseSessionId'
import { parseTime, formatDuration } from 'util/datetime'
import { canUnlock, getUnlockTime } from '../../../shared/canUnlock'
import locations from '../../../locations'
import styles from './styles.scss'
import authContainer from "containers/authContainer";

const getSessionId = ({ reservationTime, locationId }) => (
  `${locationId}/${reservationTime}`
)

const Countdown = ({ to }) => {
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now())
    }, 500)

    return () => clearInterval(interval)
  }, [])

  const diff = to - now
  return formatDuration(diff)
}

const Unlocker = ({ reservation, chargeError }) => {
  const [unlocked, setUnlocked] = useState(false)
  const [error, setError] = useState(false)
  const hasAccess = canUnlock(reservation)

  if (!hasAccess) return (
    <div className={styles.unlockDisabled} data-label>
      Access Door in <Countdown to={getUnlockTime(reservation)} />
    </div>
  )

  const onClick = () => {
    if (chargeError) return
    if (unlocked) return

    setError()

    const userId = authContainer.userId
    const reservationId = reservation.id
    unlockDoor({ userId, reservationId })
      .then(() => {
        setUnlocked(true)
        setError()

        setTimeout(() => {
          setUnlocked(false)
        }, 3000)
      })
      .catch((err) => {
        setError(err)
      })
  }

  return (
    <>
      {!unlocked && !chargeError && <div className={styles.unlock} data-label>
        Tap to Unlock Door
      </div>}

      {unlocked && <div className={styles.unlockSuccess} data-label>
        Unlocked!
      </div>}

      {(chargeError || error) && <div className={styles.unlockError} data-label>
        {chargeError || error}
      </div>}

      <div
        className={styles.unlockTarget}
        onClick={onClick}
        data-error={!!(chargeError || error)}
        data-success={unlocked}
      />
    </>
  )
}

const ReservationRange = ({
  showRemove,
  reservationClass,
  showUnlock,
  reservations
}) => {
  const firstSessionId = getSessionId(reservations[0])
  const lastSessionId = getSessionId(reservations[reservations.length - 1])

  const first = parseSessionId(firstSessionId)
  const last = parseSessionId(lastSessionId)

  const premium = reservations[0].isPremium

  const remove = () => {
    reservations.forEach(r => {
      const sessionId = getSessionId(r)
      cartContainer.removeItem(sessionId)
    })
  }

  const { locationId } = first
  const location = locations[locationId] || {}

  const now = Date.now()
  const currentReservation = reservations.find(r => now >= r.startTime) || reservations[0]

  const errored = reservations.find(r => r.chargeError)
  const chargeError = errored ? errored.chargeError : null

  return (
    <div className={classNames(styles.reservation, reservationClass)}>
      {showUnlock && <Unlocker reservation={currentReservation} chargeError={chargeError} />}

      <div className={styles.inner}>
        {premium && <span className={styles.premiumLabel}>
          <RateLabel rate={{ displayName: 'Premium' }} />
        </span>}

        <label>
          {location.displayName} • {first.formattedDate}
        </label>

        <p className={styles.date}>
          {first.formattedTime} - {last.formattedEndTime}
        </p>

        {showRemove && <div className={styles.remove} onClick={remove}>✕</div>}
      </div>
    </div>
  )
}

const Reservations = ({
  reservations,
  reservationClass,
  showUnlock = false,
  showRemove = false,
  reverse = false
}) => {
  const sortedReservations = reservations.sort((a, b) => {
    return a.reservationTime > b.reservationTime ? 1 : -1
  })

  let ranges = []

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

  if (reverse) ranges = ranges.reverse()

  return (
    <div>
      {ranges.map((range, i) => (
        <ReservationRange
          reservations={range}
          reservationClass={reservationClass}
          showRemove={showRemove}
          showUnlock={showUnlock}
          key={i}
        />
      ))}
    </div>
  )
}

export default Reservations
