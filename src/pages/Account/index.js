import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Layout from 'components/Layout'

import styles from './styles.scss'
import { getReservations } from 'api'
import { INTERVAL_MS } from "util/getPodSessions"
import authContainer from 'containers/authContainer'
import AccountInfo from 'components/AccountInfo'
import Reservations from 'components/Reservations'

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

      <Link to="/reserve" data-link>
        + Book another table
      </Link>

      <br />
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
  const {
    user
  } = authContainer

  useEffect(() => {
    getReservations({
      userId: user.id
    })
      .then(({
        reservations
      }) => {
        setUserReservations(reservations)
      })
  }, [user.id])

  return (
    <Layout className={styles.account}>
      <div data-row className={styles.details}>
        <div data-col={12}>
          <h1>My Account</h1>

          <AccountInfo />

          <UserReservations reservations={userReservations} />
        </div>
      </div>
    </Layout>
  )
}

export default Account
