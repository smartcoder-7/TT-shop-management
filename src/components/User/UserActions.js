import React from 'react'
import { Link } from 'react-router-dom'

import styles from './styles.scss'
import UpdateBillingInfo from 'components/modalActions/UpdateBillingInfo'
import OpenStore from '../modalActions/OpenStore';
import authContainer from 'containers/authContainer';

const UserActions = () => {
  return (
    <div className={styles.userActions}>
      <Link to="/shop" data-link>
        Shop
      </Link>

      <Link to="/reserve" data-link>
        Book Tables
      </Link>

      <UpdateBillingInfo theme='dark'>{({ onClick }) => (
        <button className={styles.tableRates} data-link onClick={onClick}>
          Update Billing Info
        </button>
      )}</UpdateBillingInfo>

      <button onClick={authContainer.logout} data-link>
        Log Out
      </button>
    </div>
  )
}


export default UserActions
