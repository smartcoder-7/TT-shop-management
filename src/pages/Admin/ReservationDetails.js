import React, { useState } from 'react'
import RateLabel from 'components/RateLabel'
import styles from './styles.scss'
import modalContainer from '../../containers/modalContainer';
import { getUser } from '../../api';

const Detail = ({ href, label, children }) => {
  const inner = (<>
    <label>{label}</label>
    {children}
  </>)

  return (
    <p data-p3 className={styles.detail}>
      {href && <a data-link href={href} target="_blank" rel="noopener noreferrer">
        {inner}
      </a>}
      {!href && inner}
    </p>
  )
}

const ReservationDetails = ({
  reservation,
  children
}) => {
  const {
    userId,
    reservationTime,
    chargeId,
    chargeError,
    isPremium,
    id
  } = reservation

  const openModal = async () => {
    const user = await getUser({ userId })
    modalContainer.open({
      content: (
        <div data-row className={styles.reservationDetails}>
          <div data-col="1" />
          <div data-col="10">
            {isPremium && <RateLabel rate={{ displayName: 'Premium' }} />}
            <h3>Reservation</h3>
            <p data-p2>#{id}</p>
            <br />
            <Detail label="Name">{user.firstName} {user.lastName}</Detail>
            <Detail label="Email">{user.email}</Detail>
            <Detail label="Active Card">{(!!user.hasActiveCard).toString()}</Detail>
            <Detail label="Stripe Customer ID" href={`https://dashboard.stripe.com/test/customers/${user.stripeId}`}>
              {user.stripeId}
            </Detail>

            {chargeId && <Detail label="[PAID] Stripe Charge ID" href={`https://dashboard.stripe.com/test/payments/${chargeId}`}>
              {chargeId}
            </Detail>}

            {!chargeId && <Detail label="[UNPAID]">{chargeError}</Detail>}
          </div>
          <div data-col="1" />
        </div>
      )
    })
  }

  return (
    <>
      <button className={styles.openDetails} data-link onClick={openModal}>
        {children}
      </button>
    </>
  )
}

export default ReservationDetails
