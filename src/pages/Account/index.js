import React, { useState, useEffect } from 'react'
import Layout from 'components/Layout'

import styles from './styles.scss'
import { getReservations, getInvites } from 'api'
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

      {!activeReservations.length && 'No upcoming reservations.'}

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

const Account = () => {
  const [userReservations, setUserReservations] = useState([])
  const [userInvites, setUserInvites] = useState([])
  const { user } = authContainer

  useEffect(() => {
    getReservations({ userId: user.id })
      .then(({ reservations }) => {
        setUserReservations(reservations)
      })
    getInvites({ invitedUser: user.id })
      .then(({ invites }) => {
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
        </div>
      </div>
    </Layout>
  )
}

export default Account
