import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Layout from 'components/Layout'

import styles from './styles.scss'
import { getReservations, getUserBilling } from 'api'
import { INTERVAL_MS } from "util/getPodSessions"
import authContainer from 'containers/authContainer'
import Reservations from 'components/Reservations'
import UserActions from './UserActions'
import Card from './Card'

const ActiveCard = () => {
  const [loading, setLoading] = useState(true)
  const [userBilling, setUserBilling] = useState()
  const { user } = authContainer

  useEffect(() => {
    if (!user.hasActiveCard) {
      setLoading(false)
      return
    }

    getUserBilling({
      userId: user.id
    })
      .then(data => {
        setLoading(false)
        setUserBilling(data)
      })
  }, [user.id])

  const cards = userBilling ? userBilling.sources.data : []
  const defaultCard = cards[0]

  if (!user.hasActiveCard) {
    return (
      <label className={styles.error}>
        <span className={styles.emoji}>❗️</span>
        Missing Payment Method
      </label>
    )
  }

  return (
    <label className={styles.activeCard}>
      <span className={styles.emoji}>💰</span>
      {loading && <Card />}
      {!loading && <Card {...defaultCard} />}
    </label>
  )
}


const AccountInfo = () => {
  const { user } = authContainer

  return (
    <div className={styles.accountInfo}>
      <div data-row>
        <div data-col={12}>
          <h1>{user.firstName} {user.lastName}</h1>
          <br />
          <label>
            <span className={styles.emoji}>🏆</span>
            Member
          </label>
          <br />
          <ActiveCard />
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
