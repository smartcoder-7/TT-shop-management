import React, { useState } from 'react'
import styles from './styles.scss'
import modalContainer from 'containers/modalContainer'
import Details from './Details'
import { cancelReservations } from 'api'
import useReservations from './useReservations';

const ReservationDetails = ({
  reservation,
  user = {},
  children
}) => {
  const { updateReservations } = useReservations()
  const {
    userId,
    chargeId,
    chargeError,
    id,
    customRate,
  } = reservation

  const cancel = () => {
    cancelReservations({ userId, reservations: [id], refund: true })
      .then(() => {
        updateReservations()
        modalContainer.close()
      })
  }

  const details = [
    {
      label: 'Reservation ID',
      content: id,
    },
    {
      label: 'User Name',
      content: `${user.firstName} ${user.lastName}`,
    },
    {
      label: 'User Email',
      content: user.email,
    },
    {
      label: 'User Has Active Card',
      content: (!!user.hasActiveCard).toString(),
    },
    customRate !== undefined ? {
      label: 'Custom Rate',
      content: `$${customRate.toFixed(2)}`,
    } : {},
    {
      label: 'Stripe Customer ID',
      href: `https://dashboard.stripe.com/test/customers/${user.stripeId}`,
      content: user.stripeId,
    },
    {
      label: 'Payment Status',
      content: chargeId ? 'Paid' : 'Unpaid'
    },
    chargeError ? {
      label: 'Payment Error',
      content: chargeError
    } : {},
    chargeId ? {
      label: 'Stripe Charge ID',
      content: chargeId
    } : {},
    {
      label: 'Actions',
      content: (
        <>
          <button onClick={cancel}>Cancel{chargeId && ' & Refund'}</button>
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

export default ReservationDetails
