import React, { useState } from 'react'
import RateLabel from 'components/RateLabel'
import styles from './styles.scss'
import modalContainer from '../../containers/modalContainer';
import { getUser } from '../../api';

const ReservationDetails = ({
  reservation: {
    userId,
    reservationTime,
    isPremium,
    id
  },
  children
}) => {
  const openModal = async () => {
    const { data: user } = await getUser({ userId })
    console.log(user)
    modalContainer.open({
      content: (
        <div data-row className={styles.reservationDetails}>
          <div data-col="1" />
          <div data-col="10">
            {isPremium && <RateLabel rate={{ displayName: 'Premium' }} />}
            <h3>Reservation</h3>
            <p data-p2>#{id}</p>
            <br />
            <p className={styles.detail}><label>Name</label>{user.firstName} {user.lastName}</p>
            <p className={styles.detail}><label>Email</label>{user.email}</p>
            <p className={styles.detail}><label>Active Card</label>{(!!user.hasActiveCard).toString()}</p>
            <p className={styles.detail}><label>Stripe ID</label>{user.stripeId}</p>
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
