import React, { useState, useEffect } from 'react'
import { Link, withRouter } from 'react-router-dom'

import cartContainer, { CartSubscriber } from 'containers/cartContainer'
import authContainer from 'containers/authContainer'
import Layout from 'components/Layout'
import Reservations from 'components/Reservations'
import parseSessionId from 'util/parseSessionId'
import UpdateBillingInfo from 'components/modalActions/UpdateBillingInfo'
import { createReservations } from 'api'

import styles from './styles.scss'
import UserBadges from '../../components/User/UserBadges';

const _Cart = ({ history }) => {
  const [submissionError, setSubmissionError] = useState()
  const { user } = authContainer

  const sessionIds = cartContainer.items || []

  const reservations = sessionIds
    .map(parseSessionId)
    .filter(r => !!r.locationId && !!r.time)
    .map(r => ({
      locationId: r.locationId,
      reservationTime: r.time,
      isPremium: cartContainer.isPremium(r.full)
    }))

  const checkout = () => {
    createReservations({ userId: user.id, reservations })
      .then((res = {}) => {
        const orderId = res.orderId
        cartContainer.empty()
        history.push(`/success/${orderId}`)
      })
      .catch((err) => {
        console.error(err)
        setSubmissionError('Could not complete reservation.')
      })
  }

  const hasBillingInfo = (
    user.stripeId &&
    user.hasActiveCard
  )

  const hasItems = !!reservations.length

  const canCheckout = hasItems && hasBillingInfo

  return (
    <Layout className={styles.cart}>
      <div data-row className={styles.details}>
        <div data-col={12}>
          <h1>Cart</h1>

          <div className={styles.items}>
            <div data-row>
              <div data-col="12">
                <Reservations reservations={reservations} />
              </div>
            </div>
          </div>

          <br />

          <div>
            <Link to={`/reserve/${cartContainer.locationId}`} data-link>
              + Add more time
            </Link>
          </div>

          <br />
          <br />

          <div className={styles.userPreview}>
            <h4>{user.firstName} {user.lastName}</h4>
            <br />
            <UserBadges />
            <br />
            <UpdateBillingInfo theme='light'>{({ onClick }) => (
              <button data-link onClick={onClick}>
                Update Billing Info
              </button>
            )}</UpdateBillingInfo>
          </div>

          {submissionError && <div>{submissionError}</div>}
        </div>
      </div>

      {canCheckout && (
        <div role="button" className={styles.checkout} onClick={checkout}>
          <label>Check Out</label>
          <div className={styles.total}>
            ${cartContainer.totalPrice} / {cartContainer.totalTime} hr
          </div>
        </div>
      )}
    </Layout>
  )
}

const Cart = (props) => (
  <CartSubscriber>{() => (
    <_Cart {...props} />
  )}</CartSubscriber>
)

export default withRouter(Cart)
