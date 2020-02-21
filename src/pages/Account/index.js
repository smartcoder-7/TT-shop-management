import React, { useState, useEffect } from 'react'
import Layout from 'components/Layout'

import styles from './styles.scss'
import { formatDate } from 'shared/datetime'
import { getReservations, searchInvites, getPurchases } from 'api'
import constants from 'shared/constants'
import authContainer from 'containers/authContainer'
import Reservations from 'components/Reservations'
import UserActions from 'components/User/UserActions'
import UserBadges from 'components/User/UserBadges'
import { ActiveReservationRange } from 'components/Reservations/ReservationRange';

const AccountInfo = () => {
  const { user } = authContainer

  const fullName = `${user.firstName || ''} ${user.lastName || ''}`
  const displayName = fullName.trim() ? fullName : 'My Account'

  return (
    <div className={styles.accountInfo}>
      <div data-row>
        <div data-col={12}>
          <h1>{displayName}</h1>
          <br />
          <UserBadges />
        </div>
      </div>
    </div>
  )
}

const UserPurchases = () => {
  const [purchases, setPurchases] = useState([])
  const [show, setShow] = useState(false)
  const { user } = authContainer

  useEffect(() => {
    if (!show) return
    getPurchases({ userId: user.id })
      .then(({ purchases }) => {
        setPurchases(purchases)
      })
  }, [user.id, show])

  return (
    <div className={styles.userPurchases}>
      <label className={styles.header} onClick={() => setShow(!show)}>
        {show ? '- Hide' : '+ Show'} Purchase History
      </label>

      {show && <div className={styles.purchases}>
        {!purchases.length && <p data-p3>No purchases made.</p>}
        {purchases
          .sort((a, b) => (a.timestamp || 0) > (b.timestamp || 0) ? -1 : 1)
          .map(p => (
            <div className={styles.purchase} key={p.id}>
              <p data-p3>{p.description || 'Miscellaneous Purchase'}</p>
              <label>
                ${(p.amount / 100).toFixed(2)}
                {p.timestamp && ` • ${formatDate(p.timestamp)}`}
              </label>
            </div>
          ))}
      </div>}
    </div>
  )
}

const Account = () => {
  return (
    <Layout className={styles.account}>
      <AccountInfo />

      <div data-row className={styles.details}>
        <div data-col={12}>
          <UserActions />
          <br />
          <UserPurchases />
        </div>
      </div>
    </Layout>
  )
}

export default Account
