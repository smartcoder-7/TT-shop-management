import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Layout from 'components/Layout'

import styles from './styles.scss'
import authContainer, { AuthSubscriber } from '../../containers/authContainer'
import { ReservationRange } from 'components/Reservation'
import { INTERVAL_MS, getDateParts } from 'util/getPodSessions'

const ReservationsPerDate = ({ date, times, locationId, reservations }) => {
  const ranges = []

  times.forEach((t, i) => {
    const time = parseInt(t)
    const end = time + INTERVAL_MS
    const lastRange = ranges[ranges.length - 1]

    const lastTime = times[i - 1]
    if (lastTime && time - lastTime === INTERVAL_MS) {
      lastRange.end = end
      lastRange.times.push(time)
      return
    }

    ranges.push({ 
      start: time, 
      end,
      times: [time]
    })
  })

  const {
    dayOfTheWeek,
    month,
    day,
    year
  } = getDateParts(new Date(date))
  
  return (
    <div className={styles.reservationDate} key={date}>

      <p className={styles.date} data-label>
        {dayOfTheWeek}, {month} {day}, {year}
      </p>

      {ranges.map(({ start, end, times }) => {
        const allReservations = times.map(time => {
          return {
            time,
            reservations: reservations[date][time]
          }
        })

        return (
          <ReservationRange 
            key={start} 
            start={start} 
            end={end} 
            tables={allReservations} 
          />
        )
      })}
    </div>
  )
}

const UserReservations = () => {
  const reservations = authContainer.user.reservations || {}
  const reservationLocations = Object.keys(reservations)

  return (
    <div className="user-reservations">
      {reservationLocations.map(locationId => {
        const location = reservations[locationId] || {}
        const reservationDates = Object.keys(location)

        return reservationDates
        .sort()
        .reverse()
        .map(date => {
          const times = Object.keys(location[date] || {})

          return (
            <ReservationsPerDate 
              key={date}
              date={date} 
              times={times} 
              locationId={locationId}
              reservations={location}
            />
          )
        })
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
          const { user } = authContainer

          return (
            <>
              <h1>Account</h1>
              
              <div className={styles.info}>
                <div className={styles.infoItem}>
                  <label>First Name</label>
                  <p>{user.firstName || 'Ping'}</p>
                </div>
                <div className={styles.infoItem}>
                  <label>Last Name</label>
                  <p>{user.lastName || 'Ponger'}</p>
                </div>

                <div className={styles.infoItem}>
                  <label>Email</label>
                  <p>{user.email}</p>
                </div>
              </div>

              <div>
                <h1>Reservations</h1>
                <br />
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
