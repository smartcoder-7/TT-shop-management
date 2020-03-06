import React, { useState, useEffect } from 'react'
import DayPicker from 'components/DayPicker'
import RateLabel from 'components/RateLabel'
import getAllSessions from '../../../shared/getAllSessions'

import styles from './styles.scss'
import ReservationDetails from './ReservationDetails'
import EmptyReservation from './EmptyReservation'
import locations from '../../../locations'
import { getDayStartTime, formatTime } from 'shared/datetime'
import useReservations, { ReservationsProvider } from './useReservations'
import useUsers from './useUsers'

const Reservation = ({ reservation, locationId, reservationTime, isPremium }) => {
  const { usersById } = useUsers()

  if (!reservation) return (
    <EmptyReservation locationId={locationId} reservationTime={reservationTime} isPremium={isPremium}>
      No Reservation
    </EmptyReservation>
  )

  const user = usersById[reservation.userId]
  const label = user ? `${user.firstName} ${user.lastName}` : 'RESERVED'

  return (
    <ReservationDetails reservation={reservation} user={user}>
      <label>{label}</label>
    </ReservationDetails>
  )
}

const Session = ({ time, tables, location, reservations = [] }) => {
  return (
    <tr className={styles.session} data-empty={!reservations.length}>
      <th className={styles.timestamp}>
        <label>
          {formatTime(time, location.timezone)}
        </label>
      </th>

      {tables.map((t, i) => {
        const res = reservations.find(r => {
          return r.suggestedTableId === t.id
        }) || reservations[i]

        if (!res) return <th></th>

        return (
          <th className={styles.table} key={t.id} data-reserved={!!res}>
            {res && res.suggestedTableId}
            <Reservation reservation={res} locationId={location.id} reservationTime={time} isPremium={true} />
          </th>
        )
      })}
    </tr>
  )
}

const SessionsData = ({ day, locationId }) => {
  const { reservations } = useReservations()
  const location = locations[locationId]
  const startTime = day
  const endTime = startTime + (1000 * 60 * 60 * 24)
  const sessions = getAllSessions({ startTime, endTime, locationId })

  const reservationsBySession = {}
  reservations
    .filter(r => r.locationId === locationId)
    .forEach(r => {
      if (r.canceled) return
      reservationsBySession[r.reservationTime] = reservationsBySession[r.reservationTime] || []
      reservationsBySession[r.reservationTime].push(r)
    })

  return (
    <div className={styles.sessionsWrapper}>
      <table className={styles.sessions}>
        <thead className={styles.session} data-header={true}>
          <tr>
            <th className={styles.timestamp}></th>

            {location.tables.map((t, i) => (
              <th className={styles.table} key={t.id}>
                <label className={styles.tableName}>Table {t.id}</label>
                {t.isPremium && <RateLabel rate={{ displayName: 'Premium' }} />}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
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
        </tbody>
      </table>
    </div>
  )
}

const LocationOverview = ({ locationId }) => {
  const location = locations[locationId]
  const [activeDay, setActiveDay] = useState(getDayStartTime(Date.now(), location.timezone))

  return (
    <ReservationsProvider startTime={activeDay}>
      <div className={styles.locationOverview}>
        <DayPicker
          className={styles.dayPicker}
          timezone={location.timezone}
          initialDay={activeDay}
          onChange={time => setActiveDay(time)}
        />
        <SessionsData day={activeDay} locationId={locationId} />
      </div>
    </ReservationsProvider>
  )
}

export default LocationOverview
