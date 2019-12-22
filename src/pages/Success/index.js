import React, { useState, useEffect } from 'react'
import { Link, withRouter } from 'react-router-dom'

import Layout from 'components/Layout'

import styles from './styles.scss'
import authContainer from '../../containers/authContainer';
import { getOrder } from '../../api';
import Reservations from '../../components/Reservations';

const Success = ({ match: { params } }, history) => {
  const [order, setOrder] = useState()
  const [loading, setLoading] = useState(true)
  const orderId = params.orderId

  useEffect(() => {
    if (!authContainer.userId) return

    setLoading(true)
    getOrder({ orderId, userId: authContainer.userId })
      .then(setOrder)
      .catch((err) => {
        console.log(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [orderId, authContainer.userId])

  if (loading) return (
    <Layout className={styles.success} />
  )

  return (
    <Layout className={styles.success}>
      <div data-row>
        <div data-col={12} className={styles.summary}>
          <h1>You're booked!</h1>

          <p data-p3>
            The card on file will be charged within 48 hours of each reservation time.
          </p>

          <br />

          {order && (
            <Reservations reservations={order.reservations} />
          )}

          <br />

          <Link to="/account">
            <button>
              Go To Your Account
            </button>
          </Link>
        </div>
      </div>
    </Layout>
  )
}

export default withRouter(Success)
