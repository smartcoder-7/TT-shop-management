import React, { useState, useEffect } from "react"
import constants from 'shared/constants'
import classNames from 'classnames'
import { unlockDoor, getUnlocks } from 'api';
import RateLabel from 'components/RateLabel'
import cartContainer from 'containers/cartContainer'
import { parseTime, formatTime, formatDuration } from 'shared/datetime'
import { canUnlock, getUnlockTime, unlockStarted, unlockEnded } from 'shared/canUnlock'
import getReservationRanges from 'shared/getReservationRanges'
import parseReservationRange from 'shared/parseReservationRange'
import styles from './styles.scss'
import authContainer from "containers/authContainer"

const WARN_UNLOCKS = 2
const MAX_UNLOCKS = 5

const getSessionId = ({ reservationTime, locationId }) => (
  `${locationId}/${reservationTime}`
)

const Countdown = ({ to, now }) => {
  const diff = to - now
  return formatDuration(diff)
}

const Unlocker = ({ startTime, endTime, reservations }) => {
  const [ready, setReady] = useState(false)
  const [unlocks, setUnlocks] = useState()
  const [now, setNow] = useState(Date.now())
  const [unlocked, setUnlocked] = useState(false)
  const [error, setError] = useState(false)
  const userId = authContainer.userId

  const currentReservation = reservations.find(r => now >= r.startTime) || reservations[0]
  const { id: reservationId } = currentReservation

  const errored = reservations.find(r => r.chargeError)
  const chargeError = errored ? errored.chargeError : null

  const checkUnlocks = () => {
    getUnlocks({ reservationId, userId }).then(u => {
      setReady(true)
      setUnlocks(u)
      if (u && u.length >= 5) {
        setError('Too many unlock attempts. Access for this reservation has been disabled.')
      }
    })
  }

  useEffect(() => {
    checkUnlocks()
    const interval = setInterval(() => {
      setNow(Date.now())
    }, 500)
    return () => clearInterval(interval)
  }, [])

  if (!ready) return null

  // This is also secured in the backend.
  const hitMax = unlocks && unlocks.length >= 5

  if (!unlockStarted({ startTime })) return (
    <div className={styles.unlockDisabled} data-label>
      Access Door in <Countdown to={getUnlockTime({ startTime })} now={now} />
    </div>
  )

  if (unlockEnded({ endTime })) return (
    <div className={styles.unlockDisabled} data-label>
      Access window has ended.
    </div>
  )

  const onClick = () => {
    if (chargeError || unlocked || hitMax) return

    setError()

    unlockDoor({ userId, reservationId })
      .then(() => {
        setUnlocked(true)
        setError()
        checkUnlocks()

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
      {!unlocked && !hitMax && !chargeError && <div className={styles.unlock} data-label>
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

  return (
    <div className={classNames(styles.reservation, reservationClass)}>
      {showUnlock && (
        <Unlocker
          startTime={range.startTime}
          endTime={range.endTime}
          reservations={reservations}
        />
      )}

      <div className={styles.inner}>
        {range.isPremium && <span className={styles.premiumLabel}>
          <RateLabel rate={{ displayName: 'Premium' }} />
        </span>}

        <label>
          {range.location.displayName} • {range.date}
        </label>

        <p className={styles.date}>
          {formatTime(range.startTime)} - {formatTime(range.endTime)}
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
  let ranges = getReservationRanges(reservations)

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
