import React, { useState, useEffect } from 'react'
import { Link, withRouter } from 'react-router-dom'

import cartContainer, { CartSubscriber } from 'containers/cartContainer'
import authContainer from 'containers/authContainer'
import Layout from 'components/Layout'
import Reservations from 'components/Reservations'
import { CartReservationRange } from 'components/Reservations/ReservationRange';
import parseSessionId from 'shared/parseSessionId'
import UserPreview from 'components/UserPreview'
import { createReservations } from 'api'

import styles from './styles.scss'
import { validateReservations } from '../../api';


const _Cart = ({ history }) => {
  const [reservations, setReservations] = useState([])
  const [submissionError, setSubmissionError] = useState()
  const { user } = authContainer

  const userId = user.id
  const sessionIds = cartContainer.items

  useEffect(() => {
    let upToDate = true

    const _reservations = sessionIds
      .map(parseSessionId)
      .filter(r => !!r.locationId && !!r.time)
      .map(r => ({
        locationId: r.locationId,
        reservationTime: r.time,
        isPremium: cartContainer.isPremium(r.full)
      }))

    validateReservations({ userId, reservations: _reservations })
      .then((data) => {
        if (upToDate) {
          setReservations(data.reservations)
        }
      })

    return () => (upToDate = false)
  }, [sessionIds])

  const checkout = () => {
    createReservations({ userId, reservations })
      .then((res = {}) => {
        const orderId = res.orderId
        cartContainer.empty()
        history.push(`/success/${orderId}`)
      })
      .catch((err) => {
        setSubmissionError(err)
      })
  }

  const hasBillingInfo = (
    user.stripeId &&
    user.hasActiveCard
  )

  const hasItems = !!reservations.length
  const hasErrors = !!reservations.find(r => !!r.error)
  const missingName = !user.firstName || !user.lastName

  const canCheckout = hasItems && !hasErrors && !missingName && hasBillingInfo

  return (
    <Layout className={styles.cart}>
      <div data-row className={styles.details}>
        <div data-col={12}>
          <h1>Cart</h1>

          {submissionError && <div data-p3 data-error>{submissionError}</div>}
          {hasErrors && <div data-p3 data-error>Please remove invalid sessions to continue.</div>}

          <div className={styles.items}>
            <div data-row>
              <div data-col="12">
                <Reservations reservations={reservations} RangeComponent={CartReservationRange} />

                {!hasItems && <p data-p3>No sessions added.</p>}
              </div>
            </div>
          </div>

          <div>
            <Link to={`/reserve/${cartContainer.locationId}`} data-link>
              + Add more time
            </Link>
          </div>

          <br />

          <UserPreview user={user} />
        </div>
      </div>

      {canCheckout && (
        <div role="button" className={styles.checkout} onClick={checkout}>
          <label>Reserve</label>
          <div className={styles.total}>
            {cartContainer.summary}
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
