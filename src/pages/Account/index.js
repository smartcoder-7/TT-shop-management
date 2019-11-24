import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Layout from 'components/Layout'

import styles from './styles.scss'
import { getReservations } from 'api'
import authContainer, { AuthSubscriber } from 'containers/authContainer'
import AccountInfo from 'components/AccountInfo'
import GroupedSessions from 'components/Sessions/GroupedSessions'
import Reservations from 'components/Reservations'
import getDateParts from 'util/getDateParts'

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
      <h1>Account</h1>
      
      <AccountInfo />

      <Link to="/reserve/0">
        <button>Reserve another Table</button>
      </Link>

      <br />
      <br />

      <div>
        <h1>Reservations</h1>
        <br />
        <div data-row>
          <div data-col="12">
            <Reservations reservations={userReservations} />
            {/* <GroupedSessions sessions={authContainer.user.reservations} /> */}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default () => (
  <AuthSubscriber>{() => (
    <Account />
  )}</AuthSubscriber>
)
