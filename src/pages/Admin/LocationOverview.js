import React, { useState, useEffect } from 'react'
import DayPicker from 'components/DayPicker'
import RateLabel from 'components/RateLabel'
import getAllSessions from '../../../shared/getAllSessions'

import styles from './styles.scss'
import { getReservations, getUser } from 'api'
import ReservationDetails from './ReservationDetails'
import locations from '../../../locations.json'
import { getDayStartTime, formatTime } from '../../util/datetime';

const IS_DEV = process.env.NODE_ENV === 'development'

const USER_CACHE = {}

const Reservation = ({ reservation }) => {
  if (!reservation) return null

  const [label, setLabel] = useState('RESERVED')

  useEffect(() => {
    const userId = reservation.userId
    let promise = USER_CACHE[userId]

    if (!promise) {
      promise = getUser({ userId })
      USER_CACHE[userId] = promise
    }

    promise.then(u => {
      setLabel(`${u.firstName} ${u.lastName}`)
    })
  }, [reservation.userId])

  return (
    <ReservationDetails reservation={reservation}>
      <label>{label}</label>
    </ReservationDetails>
  )
}

const Session = ({ time, tables, location, reservations = [] }) => {
  const premiumTables = tables.filter(t => t.isPremium)
  const regularTables = tables.filter(t => !t.isPremium)

  const premiumReservations = reservations.filter(t => t.isPremium)
  const regularReservations = reservations.filter(t => !t.isPremium)

  return (
    <div className={styles.session} data-empty={!reservations.length}>
      <div className={styles.timestamp}>
        <label>
          {formatTime(time, location.timezone)}
        </label>
      </div>

      <div className={styles.tables}>
        {premiumTables.map((t, i) => {
          const res = premiumReservations[i]

          return (
            <div className={styles.table} key={t.id} data-reserved={!!res}>
              <Reservation reservation={res} />
            </div>
          )
        })}

        {regularTables.map((t, i) => {
          const res = regularReservations[i]

          return (
            <div className={styles.table} key={t.id} data-reserved={!!res}>
              <Reservation reservation={res} />
            </div>
          )
        })}
      </div>
    </div>
  )
}

const SessionsData = ({ day }) => {
  const [reservations, setReservations] = useState([])
  const location = locations['0']
  const startTime = day
  const endTime = startTime + (1000 * 60 * 60 * 24)
  const sessions = getAllSessions({ startTime, endTime, locationId: '0' })

  useEffect(() => {
    getReservations({ startTime })
      .then(({ reservations: r }) => {
        setReservations(r)
      })
  }, [])

  const reservationsBySession = {}
  reservations.forEach(r => {
    reservationsBySession[r.reservationTime] = reservationsBySession[r.reservationTime] || []
    reservationsBySession[r.reservationTime].push(r)
  })

  return (
    <div className={styles.sessions}>
      <div className={styles.session} data-header={true}>
        <div className={styles.timestamp}></div>

        <div className={styles.tables}>
          {location.tables.map((t, i) => (
            <div className={styles.table} key={t.id}>
              <label className={styles.tableName}>Table {t.id}</label>
              {t.isPremium && <RateLabel rate={{ displayName: 'Premium' }} />}
            </div>
          ))}
        </div>
      </div>

      {sessions.map(s => {
        return (
          <Session
            key={s}
            time={s}
            location={location}
            reservations={reservationsBySession[s]}
            tables={location.tables}
          />
        )
      })}
    </div>
  )
}

const LocationOverview = ({ locationId }) => {
  const location = locations[locationId]
  const [activeDay, setActiveDay] = useState(getDayStartTime(Date.now(), location.timezone))

  return (
    <div className={styles.locationOverview}>
      <DayPicker
        className={styles.dayPicker}
        timezone={location.timezone}
        initialDay={activeDay}
        onChange={time => setActiveDay(time)}
      />
      <SessionsData day={activeDay} />
    </div>
  )
}

export default LocationOverview
