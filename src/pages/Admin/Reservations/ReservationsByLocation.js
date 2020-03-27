import React, { useState, useEffect } from 'react'
import moment from 'moment-timezone'
import DayPicker from 'components/DayPicker'
import RateLabel from 'components/RateLabel'
import FilterableTable from 'react-filterable-table'

import getAllSessions from '../../../../shared/getAllSessions'
import EditReservation from './ReservationDetails'
import styles from './styles.scss'
import useSessionRange from 'components/useSessionRange'
import Reservations from '.'
import EmptyReservation from '../EmptyReservation'
import locations from '../../../../locations'
import { getDayStartTime, formatTime } from 'shared/datetime'
import useReservations, { ReservationsProvider } from '../useReservations'
import useUsers from '../useUsers'

const Reservation = ({ reservation, locationId, reservationTime }) => {
  const { usersById } = useUsers()

  if (!reservation) return (
    <EmptyReservation locationId={locationId} reservationTime={reservationTime} >
      <span data-p3>---</span>
    </EmptyReservation>
  )

  const user = usersById[reservation.userId]
  const label = user ? `${user.firstName} ${user.lastName}` : 'RESERVED'

  return null
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
        })

        return (
          <th className={styles.table} key={t.id} data-reserved={!!res}>
            <Reservation reservation={res} locationId={location.id} reservationTime={time} />
          </th>
        )
      })}
    </tr>
  )
}

const AllSessions = ({ startTime, locationId }) => {
  const location = locations[locationId]
  const sessions = getAllSessions({ startTime, locationId })

  const { usersById } = useUsers()
  const { reservations, reservationsById } = useReservations()
  const { tables, timezone } = location

  const renderDatetime = ({ value }) => {
    const m = moment(new Date(value)).tz(timezone)
    return m.format('hh:mma')
  }

  const data = sessions
    .map(time => {
      const m = moment(new Date(time)).tz(timezone)
      return {
        time,
        day: m.format('ddd'),
        date: m.format('YYYY-MM-DD'),
        tables: tables.map(t => t.id),
        reservations: reservations
          .filter(r => !r.canceled)
          .filter(r => r.reservationTime === time)
      }
    });

  const fields = [
    { name: 'day', displayName: "Day" },
    { name: 'date', displayName: "Date", inputFilterable: true, exactFilterable: true, sortable: true },
    { name: 'time', displayName: "Time", sortable: true, render: renderDatetime },
    ...tables.map(t => {
      const renderTable = ({ value, record }) => {
        const match = record.reservations.find(r => r.suggestedTableId === t.id)
        if (!match) return (
          <EmptyReservation locationId={locationId} reservationTime={value}>
            <span data-p3>---</span>
          </EmptyReservation>
        )

        const user = usersById[match.userId]

        return (
          <EditReservation reservation={match}>
            {user.firstName} {user.lastName}
          </EditReservation>
        )
      }

      return {
        name: 'time',
        displayName: t.displayName,
        render: renderTable
      }
    })
  ];

  return (
    <div className={styles.userOverview}>
      <FilterableTable
        namespace="Sessions"
        initialSort="reservationTime"
        data={data}
        fields={fields}
        noRecordsMessage="There are no sessions to display"
        noFilteredRecordsMessage="No sessions match your filters."
        pageSize={40}
        pageSizes={null}
      />
    </div>
  )
}

const ReservationsByLocation = ({ locationId }) => {
  const location = locations[locationId]
  const { startTime, endTime, requestTime } = useSessionRange({ location })

  if (!startTime) return null

  return (
    <ReservationsProvider startTime={startTime} locationId={locationId}>
      <AllSessions startTime={startTime} locationId={locationId} />
    </ReservationsProvider>
  )
}

export default ReservationsByLocation
