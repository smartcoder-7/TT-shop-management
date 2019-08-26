import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Layout from 'components/Layout'

import styles from './styles.scss'
import authContainer, { AuthSubscriber } from '../../containers/authContainer'


const Reservation = ({ docRef }) => {
  const [doc, setDoc] = useState()

  useEffect(() => {
    docRef.get().then(setDoc)
  }, [])

  if (!doc || !doc.exists) return null

  const { date, time, locationId } = doc.data()
  return (
    <div>
      {date} {time}
    </div>
  )
}

const UserReservations = () => {
  const reservations = authContainer.user.reservations || {}
  const reservationDates = Object.keys(reservations)

  return reservationDates.map(date => {
    const times = Object.keys(reservations[date] || {})
    return times.map(time => {
      const tables = reservations[date][time]

      return tables.map(tableRef => {
        return <Reservation key={tableRef.id} docRef={tableRef} />
      })
    })
  })
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
                <UserReservations />
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
