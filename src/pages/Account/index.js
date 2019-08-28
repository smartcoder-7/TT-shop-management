import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Layout from 'components/Layout'

import styles from './styles.scss'
import authContainer, { AuthSubscriber } from '../../containers/authContainer'
import Reservation from 'components/Reservation'

const UserReservations = () => {
  const reservations = authContainer.user.reservations || {}
  const reservationDates = Object.keys(reservations)

  return (
    <div className="user-reservations">
      {reservationDates.map(date => {
        const times = Object.keys(reservations[date] || {})
        return (
          <div key={date}>
            <div>Date: {date}</div>
            {times.map(time => {
              const tables = reservations[date][time]

              return tables.map(tableRef => {
                return <Reservation key={tableRef.id} docRef={tableRef} />
              })
            })}
          </div>
        )
      })}
    </div>
  )
}


class Account extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {    
    return (
      <Layout className={styles.account}>
        <AuthSubscriber>{() => {
          return (
            <>
              <h1>Account</h1>

              <div>
                <h2>My Reservations</h2>
                <div data-row>
                  <div data-col="12">
                    <UserReservations />
                  </div>
                </div>
              </div>

              <Link to="/reserve/0">
                <button>Reserve another Table</button>
              </Link>
            </>
          )
        }}</AuthSubscriber>
      </Layout>
    )
  }
}

export default Account
