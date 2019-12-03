import React from 'react'
import { Link } from 'react-router-dom'

import styles from './styles.scss'
import UpdateBillingInfo from 'components/modalActions/UpdateBillingInfo'

const UserActions = () => {
  return (
    <div className={styles.userActions}>
      <UpdateBillingInfo>{({ onClick }) => (
        <button className={styles.tableRates} data-link onClick={onClick}>
          + Update Billing Info
        </button>
      )}</UpdateBillingInfo>

      <Link to="/reserve" data-link>
        + Book Tables
      </Link>
    </div>
  )
}


export default UserActions
