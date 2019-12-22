import React, { useState, useEffect } from 'react'
import { Link, withRouter } from 'react-router-dom'

import Layout from 'components/Layout'

import styles from './styles.scss'
import authContainer from '../../containers/authContainer';
import { getOrder } from '../../api';
import Reservations from '../../components/Reservations';

const Success = ({ match: { params } }, history) => {
  const [order, setOrder] = useState()
  const orderId = params.orderId

  useEffect(() => {
    if (!authContainer.userId) return

    getOrder({ orderId, userId: authContainer.userId })
      .then(setOrder)
      .catch((err) => {
        console.log(err)
      })
  }, [orderId, authContainer.userId])

  return (
    <Layout className={styles.success}>
      <div data-row className={styles.details}>
        <div data-col={12}>
          <h1>You're booked!</h1>

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
