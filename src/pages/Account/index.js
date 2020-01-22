import React, { useState, useEffect } from 'react'
import Layout from 'components/Layout'

import styles from './styles.scss'
import { getReservations } from 'api'
import { INTERVAL_MS } from 'util/constants'
import authContainer from 'containers/authContainer'
import Reservations from 'components/Reservations'
import UserActions from 'components/User/UserActions'
import UserBadges from 'components/User/UserBadges'


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

const UserReservations = ({ reservations }) => {
  const [showPast, setShowPast] = useState(false)

  const sortedReservations = reservations.sort((a, b) => {
    return a.reservationTime > b.reservationTime ? 1 : -1
  })

  const activeReservations = []
  const pastReservations = []

  sortedReservations.forEach((res) => {
    const isActive = res.reservationTime >= Date.now() - INTERVAL_MS

    if (isActive) activeReservations.push(res)
    else pastReservations.push(res)
  })

  return (
    <div className={styles.userReservations}>
      <label className={styles.header}>Upcoming Reservations</label>
      <Reservations
        reservations={activeReservations}
        reservationClass={styles.reservation}
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
  const { user } = authContainer

  useEffect(() => {
    getReservations({ userId: user.id })
      .then(({ reservations }) => {
        setUserReservations(reservations)
      })
  }, [user.id])

  return (
    <Layout className={styles.account}>
      <AccountInfo />

      <div data-row className={styles.details}>
        <div data-col={12}>
          <UserActions />
          <UserReservations reservations={userReservations} />
        </div>
      </div>
    </Layout>
  )
}

export default Account
