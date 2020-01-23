import React, { useState, useEffect } from "react"
import constants from 'shared/constants'
import classNames from 'classnames'
import { unlockDoor } from 'api';
import RateLabel from 'components/RateLabel'
import cartContainer from 'containers/cartContainer'
import { parseTime, formatDuration } from 'shared/datetime'
import { canUnlock, getUnlockTime } from 'shared/canUnlock'
import getReservationRanges from 'shared/getReservationRanges'
import parseReservationRange from 'shared/parseReservationRange'
import styles from './styles.scss'
import authContainer from "containers/authContainer"

const getSessionId = ({ reservationTime, locationId }) => (
  `${locationId}/${reservationTime}`
)

const Countdown = ({ to, now }) => {
  const diff = to - now
  return formatDuration(diff)
}

const Unlocker = ({ reservation, chargeError }) => {
  const [now, setNow] = useState(Date.now())
  const [unlocked, setUnlocked] = useState(false)
  const [error, setError] = useState(false)
  const hasAccess = canUnlock(reservation)

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now())
    }, 500)

    return () => clearInterval(interval)
  }, [])

  if (!hasAccess) return (
    <div className={styles.unlockDisabled} data-label>
      Access Door in <Countdown to={getUnlockTime(reservation)} now={now} />
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
  const range = parseReservationRange(reservations)

  const remove = () => {
    reservations.forEach(r => {
      const sessionId = getSessionId(r)
      cartContainer.removeItem(sessionId)
    })
  }

  const now = Date.now()
  const currentReservation = reservations.find(r => now >= r.startTime) || reservations[0]

  const errored = reservations.find(r => r.chargeError)
  const chargeError = errored ? errored.chargeError : null

  return (
    <div className={classNames(styles.reservation, reservationClass)}>
      {showUnlock && <Unlocker reservation={currentReservation} chargeError={chargeError} />}

      <div className={styles.inner}>
        {range.isPremium && <span className={styles.premiumLabel}>
          <RateLabel rate={{ displayName: 'Premium' }} />
        </span>}

        <label>
          {range.location} • {range.date}
        </label>

        <p className={styles.date}>
          {range.startTime} - {range.endTime}
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
  const ranges = getReservationRanges(reservations)

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
