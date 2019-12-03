import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Layout from 'components/Layout'

import styles from './styles.scss'
import { getDateParts } from 'util/datetime'
import { getReservations, getUserBilling } from 'api'
import { INTERVAL_MS } from "util/getPodSessions"
import authContainer from 'containers/authContainer'
import Reservations from 'components/Reservations'
import UserActions from './UserActions'
import ActiveCard from './ActiveCard'
import UserBadge from './UserBadge'


const AccountInfo = () => {
  const { user } = authContainer

  const format = d => {
    const { monthAbbr, year } = getDateParts(d)
    return `${monthAbbr} ${year}`
  }

  return (
    <div className={styles.accountInfo}>
      <div data-row>
        <div data-col={12}>
          <h1>{user.firstName} {user.lastName}</h1>
          <br />
          <UserBadge emoji='⭐️'>Member</UserBadge>
          <ActiveCard />
          <UserBadge emoji='🏓'>Joined {format(user.createdAt)}</UserBadge>
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
      <h3>Reservations</h3>
      <Reservations reservations={activeReservations} />

      {!activeReservations.length && 'No upcoming reservations.'}

      <br />
      <br />

      <label className={styles.showPast} onClick={() => setShowPast(!showPast)}>
        {showPast ? '- Hide' : '+ Show'} Past Reservations
      </label>
      {showPast && <Reservations reservations={pastReservations} />}
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
