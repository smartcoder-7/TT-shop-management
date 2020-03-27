import React, { useState, useEffect } from 'react'
import moment from 'moment-timezone'
import FilterableTable from 'react-filterable-table'

import styles from './styles.scss'
import useReservations, { ReservationsProvider } from '../useReservations'
import useUsers from '../useUsers'
import EditReservation from './ReservationDetails'

const Reservations = () => {
  const { usersById } = useUsers()
  const { reservations, reservationsById } = useReservations()

  const data = reservations
    .map(r => {
      const user = usersById[r.userId] || {}
      const m = moment(new Date(r.reservationTime)).tz('America/New_York')

      return {
        ...r,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        date: m.format('YYYY-MM-DD')
      }
    });

  const renderDatetime = ({ value }) => {
    const m = moment(new Date(value)).tz('America/New_York')
    return m.format('hh:mma')
  }

  const renderEdit = ({ value }) => {
    return <EditReservation reservation={reservationsById[value]}>View/Edit</EditReservation>
  }

  const fields = [
    { name: 'id', displayName: "Edit", render: renderEdit },
    { name: 'firstName', displayName: "First Name", inputFilterable: true, sortable: true },
    { name: 'lastName', displayName: "Last Name", inputFilterable: true, sortable: true },
    { name: 'email', displayName: "Email", inputFilterable: true, sortable: true },
    { name: 'date', displayName: "Date", inputFilterable: true, exactFilterable: true, sortable: true },
    { name: 'reservationTime', displayName: "Time", inputFilterable: true, sortable: true, render: renderDatetime },
    { name: 'locationId', displayName: "Location", inputFilterable: true, exactFilterable: true, sortable: true },
  ];

  return (
    <div className={styles.userOverview}>
      <FilterableTable
        namespace="Users"
        initialSort="lastName"
        data={data}
        fields={fields}
        noRecordsMessage="There are no users to display"
        noFilteredRecordsMessage="No users match your filters."
        pageSize={15}
        pageSizes={null}
      />
    </div>
  )
}

const startTime = Date.now() - (1000 * 60 * 60 * 24 * 30)

export default ({ locationId }) => {
  return (
    <ReservationsProvider startTime={startTime} locationId={locationId}>
      <Reservations />
    </ReservationsProvider>
  )
}
