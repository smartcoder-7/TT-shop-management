import React from 'react'

import UpdateBillingInfo from 'components/modalActions/UpdateBillingInfo'
import UpdateName from 'components/modalActions/UpdateName'

import styles from './styles.scss'
import UserBadges from '../../components/User/UserBadges';

const UserPreview = ({ user }) => {
  const hasBillingInfo = (
    user.stripeId &&
    user.hasActiveCard
  )
  const missingName = !user.firstName || !user.lastName

  return (
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
  )
}

export default UserPreview