import React, { useState, useEffect } from 'react'
import { Link, withRouter } from 'react-router-dom'
import qs from 'qs'

import Layout from 'components/Layout'
import Logo from 'components/Logo'
import DayPicker from 'components/DayPicker'
import EmailSubscribe from 'components/EmailSubscribe'
import getAllSessions from 'util/getAllSessions'

import styles from './styles.scss'
import contextContainer from 'containers/contextContainer'
import { getReservations } from 'api'
import locations from '../../../locations.json'
import { getDayStartTime, formatTime } from '../../util/datetime';

const IS_DEV = process.env.NODE_ENV === 'development'

const Session = ({ time, tables, reservations = [] }) => {
  return (
    <div className={styles.session} data-empty={!reservations.length}>
      <div className={styles.timestamp}>
        <label>
          {formatTime(time)}
        </label>
      </div>

      <div className={styles.tables}>
        {tables.map((t, i) => {
          const res = reservations[i]

          return (
            <div className={styles.table} key={t.id} data-reserved={!!res}>
              <label>{res && 'RESERVED'}</label>
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
  const { sessions } = getAllSessions({ startTime, endTime, locationId: '0' })

  useEffect(() => {
    getReservations({ startTime })
      .then(({ reservations: r }) => setReservations(r))
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
              <label>Table {t.id}</label>
            </div>
          ))}
        </div>
      </div>

      {sessions.map(s => {
        return (
          <Session
            key={s}
            time={s}
            reservations={reservationsBySession[s]}
            tables={location.tables}
          />
        )
      })}
    </div>
  )
}

const Admin = () => {
  const [activeDay, setActiveDay] = useState(getDayStartTime(Date.now()))

  return (
    <Layout className={styles.admin}>
      <div data-row>
        <div className={styles.intro} data-col="12">
          <h1>
            <Logo className={styles.logo} theme="pink" />
            ADMIN
          </h1>

          <div>
            <DayPicker
              className={styles.dayPicker}
              initialDay={activeDay}
              onChange={time => setActiveDay(time)}
            />
            <SessionsData day={activeDay} />
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default withRouter(Admin)
