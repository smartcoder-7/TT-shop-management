import React from "react"
import classNames from 'classnames'
import RateLabel from 'components/RateLabel'
import cartContainer from 'containers/cartContainer'
import authContainer from 'containers/authContainer'
import parseReservationRange from 'shared/parseReservationRange'
import styles from './styles.scss'
import Unlocker from './Unlocker'
import InviteAFriend from "../InviteAFriend";

const getSessionId = ({ reservationTime, locationId }) => (
  `${locationId}/${reservationTime}`
)

const RangeInfo = ({ range }) => {
  const { location, tableId } = range
  const table = location.tables.find(t => t.id === tableId)

  return (
    <>
      {table && <span className={styles.table}>
        <RateLabel rate={{ displayName: table.displayName }} />
      </span>}

      {range.inviteId && <span className={styles.inviteLabel}><RateLabel rate={{ displayName: 'By Invitation' }} /></span>}

      <label>
        {range.location.displayName} • {range.date}
      </label>

      <p className={styles.date}>
        {range.startTimeFormatted} - {range.endTimeFormatted}
      </p>
    </>
  )
}

export const ReservationRange = ({
  reservationClass,
  reservations
}) => {
  const range = parseReservationRange(reservations)

  return (
    <div className={classNames(styles.reservation, reservationClass)}>
      <div className={styles.inner}>
        <RangeInfo range={range} />
      </div>
    </div>
  )
}

export const ActiveReservationRange = ({
  reservationClass,
  reservations
}) => {
  const range = parseReservationRange(reservations)
  const isOwner = range.userId === authContainer.userId

  range.invites = range.invites || []

  const pendingInvites = range.invites.filter(i => !i.invitedUser).length
  const acceptedInvites = range.invites.filter(i => i.invitedUser).length

  return (
    <div className={classNames(styles.reservation, reservationClass)}>
      <Unlocker
        startTime={range.startTime}
        endTime={range.endTime}
        reservations={reservations}
      />

      <div className={styles.inner}>
        <RangeInfo range={range} />

        {isOwner && (
          <div className={styles.invites}>
            <br />
            <InviteAFriend reservations={reservations}>
              <button data-mini>+ Invite a Friend</button>
            </InviteAFriend>
            {!!pendingInvites && <p data-label>{pendingInvites} invite(s) pending</p>}
            {!!acceptedInvites && <p data-label>{acceptedInvites} invite(s) accepted</p>}
          </div>
        )}
      </div>
    </div>
  )
}

export const CartReservationRange = ({
  reservationClass,
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
      <div className={styles.inner}>
        <RangeInfo range={range} />
        <div className={styles.remove} onClick={remove}>✕</div>
      </div>
    </div>
  )
}
