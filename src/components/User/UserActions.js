import React from 'react'
import { Link } from 'react-router-dom'

import styles from './styles.scss'
import UpdateBillingInfo from 'components/modalActions/UpdateBillingInfo'
import OpenStore from '../modalActions/OpenStore';
import authContainer from 'containers/authContainer';

const UserActions = () => {
  return (
    <div className={styles.userActions}>
      <OpenStore userId={authContainer.userId}>{({ open }) => (
        <button data-link onClick={open}>
          + Shop
        </button>
      )}</OpenStore>

      <Link to="/reserve" data-link>
        + Book Tables
      </Link>

      <UpdateBillingInfo theme='dark'>{({ onClick }) => (
        <button className={styles.tableRates} data-link onClick={onClick}>
          + Update Billing Info
        </button>
      )}</UpdateBillingInfo>
    </div>
  )
}


export default UserActions
