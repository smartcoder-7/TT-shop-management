import React, { useState, useEffect } from 'react'
import Layout from 'components/Layout'

import styles from './styles.scss'
import { formatDate } from 'shared/datetime'
import { getReservations, searchInvites, getPurchases } from 'api'
import constants from 'shared/constants'
import authContainer from 'containers/authContainer'
import Reservations from 'components/Reservations'
import UserActions from 'components/User/UserActions'
import UserBadges from 'components/User/UserBadges'
import { ActiveReservationRange } from 'components/Reservations/ReservationRange';


const AccountInfo = () => {
  const { user } = authContainer

  const fullName = `${user.firstName || ''} ${user.lastName || ''}`
  const displayName = fullName.trim() ? fullName : 'My Account'

  return (
    <div className={styles.accountInfo}>
      <div data-row>
        <div data-col={12}>
          <h1>{displayName}</h1>
          <br />
          <UserBadges />
        </div>
      </div>
    </div>
  )
}

const UserReservations = ({ reservations, invites }) => {
  const [showPast, setShowPast] = useState(false)

  const sortedReservations = reservations
    .filter(r => !r.canceled)
    .sort((a, b) => {
      return a.reservationTime > b.reservationTime ? 1 : -1
    })

  const isActive = r => r.reservationTime >= Date.now() - constants.INTERVAL_MS
  const isPast = r => !isActive(r)

  const activeReservations = sortedReservations.filter(isActive)
  const pastReservations = sortedReservations.filter(isPast)
  const activeInvites = invites.filter(i => isActive(i.reservation))

  return (
    <div className={styles.userReservations}>
      <label className={styles.header}>Upcoming Reservations</label>
      <Reservations
        invites={activeInvites}
        reservations={activeReservations}
        reservationClass={styles.reservation}
        RangeComponent={ActiveReservationRange}
        showUnlock
      />

      {!activeReservations.length && !activeInvites.length && <p data-p3>No upcoming reservations.</p>}

      <br />

      {!!pastReservations.length && (
        <label className={styles.showPast} onClick={() => setShowPast(!showPast)}>
          {showPast ? '- Hide' : '+ Show'} Past Reservations
        </label>
      )}
      {showPast && <Reservations reservations={pastReservations} reverse />}
    </div>
  )
}

const UserPurchases = () => {
  const [purchases, setPurchases] = useState([])
  const [show, setShow] = useState(false)
  const { user } = authContainer

  useEffect(() => {
    if (!show) return
    getPurchases({ userId: user.id })
      .then(({ purchases }) => {
        setPurchases(purchases)
      })
  }, [user.id, show])

  return (
    <div className={styles.userPurchases}>
      <label className={styles.header} onClick={() => setShow(!show)}>
        {show ? '- Hide' : '+ Show'} Purchase History
      </label>

      {show && <div className={styles.purchases}>
        {!purchases.length && <p data-p3>No purchases made.</p>}
        {purchases
          .sort((a, b) => (a.timestamp || 0) > (b.timestamp || 0) ? -1 : 1)
          .map(p => (
            <div className={styles.purchase} key={p.id}>
              <p data-p3>{p.description || 'Miscellaneous Purchase'}</p>
              <label>
                ${(p.amount / 100).toFixed(2)}
                {p.timestamp && ` • ${formatDate(p.timestamp)}`}
              </label>
            </div>
          ))}
      </div>}
    </div>
  )
}

const Account = () => {
  const [userReservations, setUserReservations] = useState([])
  const [userInvites, setUserInvites] = useState([])
  const { user } = authContainer

  useEffect(() => {
    getReservations({ userId: user.id, withInvites: true })
      .then(({ reservations }) => {
        setUserReservations(reservations)
      })
    searchInvites({
      rules: [
        ['invitedUser', '==', user.id]
      ]
    })
      .then((invites) => {
        setUserInvites(invites)
      })
  }, [user.id])

  return (
    <Layout className={styles.account}>
      <AccountInfo />

      <div data-row className={styles.details}>
        <div data-col={12}>
          <UserActions />
          <UserReservations reservations={userReservations} invites={userInvites} />
          <br />
          <UserPurchases />
        </div>
      </div>
    </Layout>
  )
}

export default Account
