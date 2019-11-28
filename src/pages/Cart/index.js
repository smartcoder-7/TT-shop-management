import React, { useState, useEffect } from 'react'
import { Link, withRouter } from 'react-router-dom'

import cartContainer, { CartSubscriber } from 'containers/cartContainer'
import authContainer from 'containers/authContainer'
import Layout from 'components/Layout'
import Reservations from 'components/Reservations'
import parseSessionId from 'util/parseSessionId'
import { createReservations } from 'api'

import styles from './styles.scss'

const _Cart = () => {
  const [submissionError, setSubmissionError] = useState()
  const { user } = authContainer

  const sessionIds = cartContainer.items || []

  const reservations = sessionIds
    .map(parseSessionId)
    .filter(r => !!r.locationId && !!r.time)
    .map(r => ({
      locationId: r.locationId,
      reservationTime: r.time
    }))

  const canCheckout = (
    reservations.length > 0 &&
    user.firstName &&
    user.lastName &&
    user.stripeId &&
    user.hasActiveCard
  )

  const checkout = () => {
    createReservations({ userId: user.id, reservations })
      .then(() => {
        cartContainer.empty()
        console.log('hey!!! redirect')
      })
      .catch((err) => {
        console.error(err)
        setSubmissionError('Could not complete reservation.')
      })
  }

  return (
    <Layout className={styles.cart}>
      <div data-row>
        <div data-col={12}>
          <h1>Cart</h1>

          <div className={styles.step}>
            <h3 className={styles.header}>Confirm Selection</h3>

            <div data-row>
              <div data-col="12">
                <Reservations reservations={reservations} />
              </div>
            </div>
          </div>

          <div>
            <Link to="/reserve/0" data-link>
              + Add more sessions
            </Link>
          </div>

          <br />

          {!canCheckout && (
            <div>
              Cannot check out. Please update billing.
            </div>
          )}
        </div>
      </div>

      <button onClick={checkout}>
        Checkout
          </button>

      {submissionError && <div>{submissionError}</div>}
    </Layout>
  )
}

const Cart = () => (
  <CartSubscriber>{() => (
    <_Cart />
  )}</CartSubscriber>
)

export default withRouter(Cart)