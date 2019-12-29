import React, { useState, useEffect } from 'react'
import { Link, withRouter } from 'react-router-dom'

import cartContainer, { CartSubscriber } from 'containers/cartContainer'
import authContainer from 'containers/authContainer'
import Layout from 'components/Layout'
import Reservations from 'components/Reservations'
import parseSessionId from 'util/parseSessionId'
import UpdateBillingInfo from 'components/modalActions/UpdateBillingInfo'
import UpdateName from 'components/modalActions/UpdateName'
import { createReservations } from 'api'

import styles from './styles.scss'
import UserBadges from '../../components/User/UserBadges';
import { validateReservations } from '../../api';

const _Cart = ({ history }) => {
  const [submissionError, setSubmissionError] = useState()
  const [reservations, setReservations] = useState([])
  const { user } = authContainer

  const userId = user.id
  const sessionIds = cartContainer.items

  useEffect(() => {
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
        setReservations(data.reservations)
      })
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
                <Reservations reservations={reservations} showRemove={true} />

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

          <div className={styles.userPreview}>
            {missingName && <UpdateName>{({ onClick }) => (
              <button data-link data-error onClick={onClick} className={styles.name}>
                + Add Name <label>(required)</label>
              </button>
            )}</UpdateName>}

            {!missingName && <h4 className={styles.name}>{user.firstName} {user.lastName}</h4>}

            <UserBadges />
            <br />

            <UpdateBillingInfo theme='dark'>{({ onClick }) => (
              <button data-link data-error={!hasBillingInfo} onClick={onClick}>
                {user.hasActiveCard
                  ? 'Update Billing Info'
                  : <span>+ Add Billing Info <label>(required)</label></span>}
              </button>
            )}</UpdateBillingInfo>
          </div>
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
