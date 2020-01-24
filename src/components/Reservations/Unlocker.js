import React, { useState, useEffect } from "react"
import { unlockDoor, getUnlocks } from 'api';
import { formatDuration } from 'shared/datetime'
import { getUnlockTime, unlockStarted, unlockEnded } from 'shared/canUnlock'
import styles from './styles.scss'
import authContainer from "containers/authContainer"

const WARN_UNLOCKS = 2
const MAX_UNLOCKS = 5

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
  const [warning, setWarning] = useState(false)
  const userId = authContainer.userId

  const currentReservation = reservations.find(r => now >= r.startTime) || reservations[0]
  const { id: reservationId } = currentReservation

  const errored = reservations.find(r => r.chargeError)
  const chargeError = errored ? errored.chargeError : null

  const checkUnlocks = () => {
    getUnlocks({ reservationId, userId }).then(u => {
      setReady(true)
      setUnlocks(u)
      if (u && u.length >= MAX_UNLOCKS) {
        setError('Too many unlock attempts. Access for this reservation has been disabled.')
      } else if (u && u.length >= WARN_UNLOCKS) {
        setWarning(`${MAX_UNLOCKS - u.length} attempts left`)
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
        Tap to Unlock Door {warning && `(${warning})`}
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

export default Unlocker