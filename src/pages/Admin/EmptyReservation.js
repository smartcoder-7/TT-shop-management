import React, { useState } from 'react'
import styles from './styles.scss'
import modalContainer from 'containers/modalContainer'
import authContainer from 'containers/authContainer'
import Details from './Details'
import { createReservations } from 'api'
import useReservations from './useReservations';

const EmptyReservation = ({
  locationId,
  reservationTime,
  children
}) => {
  const { updateReservations } = useReservations()
  const { userId } = authContainer

  const adminBook = () => {
    createReservations({
      userId,
      reservations: [
        { reservationTime, locationId, customRate: 0 }
      ]
    })
      .then(() => {
        updateReservations()
        modalContainer.close()
      })
  }

  const details = [
    {
      label: 'Actions',
      content: (
        <>
          <button onClick={adminBook}>Book Reservation</button>
        </>
      )
    }
  ]

  return (
    <Details
      title="Reservation Details"
      details={details}
    >{({ openModal }) => (
      <button className={styles.openDetails} data-link onClick={openModal} style={{ minWidth: '120px' }}>
        {children}
      </button>
    )}</Details>
  )
}

export default EmptyReservation
