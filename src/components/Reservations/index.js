import React from "react"
import classNames from 'classnames'
import RateLabel from 'components/RateLabel'
import cartContainer from 'containers/cartContainer'
import getReservationRanges from 'shared/getReservationRanges'
import parseReservationRange from 'shared/parseReservationRange'
import styles from './styles.scss'
import Unlocker from './Unlocker'

const getSessionId = ({ reservationTime, locationId }) => (
  `${locationId}/${reservationTime}`
)

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
          {range.startTimeFormatted} - {range.endTimeFormatted}
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
