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
    // {
    //   label: 'Reservation ID',
    //   content: id,
    // },
    // {
    //   label: 'User Name',
    //   content: `${user.firstName} ${user.lastName}`,
    // },
    // {
    //   label: 'User Email',
    //   content: user.email,
    // },
    // {
    //   label: 'User Has Active Card',
    //   content: (!!user.hasActiveCard).toString(),
    // },
    // {
    //   label: 'Stripe Customer ID',
    //   href: `https://dashboard.stripe.com/test/customers/${user.stripeId}`,
    //   content: user.stripeId,
    // },
    // {
    //   label: 'Payment Status',
    //   content: chargeId ? 'Paid' : 'Unpaid'
    // },
    // chargeError ? {
    //   label: 'Payment Error',
    //   content: chargeError
    // } : {},
    // chargeId ? {
    //   label: 'Stripe Charge ID',
    //   content: chargeId
    // } : {},
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
      <button className={styles.openDetails} data-link onClick={openModal}>
        {children}
      </button>
    )}</Details>
  )
}

export default EmptyReservation
