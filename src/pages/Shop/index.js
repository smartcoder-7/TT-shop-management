import React, { useState, useEffect } from 'react'

import authContainer from 'containers/authContainer'
import Layout from 'components/Layout'
import ProductPicker from 'components/ProductPicker'

import styles from './styles.scss'
import UserPreview from '../../components/UserPreview';


const Shop = ({ }) => {
  const userId = authContainer.userId
  const user = authContainer.user

  const hasBillingInfo = (
    user.stripeId &&
    user.hasActiveCard
  )

  const missingName = !user.firstName || !user.lastName

  const canCheckout = !missingName && hasBillingInfo

  return (
    <Layout className={styles.shop}>
      <div data-row>
        <div data-col="12" >
          <div className={styles.header}>
            <span data-label>Shop</span>
          </div>

          <UserPreview user={user} />
          {canCheckout && <ProductPicker onPurchase={() => modalContainer.close()} userId={userId} />}
        </div>
      </div>
    </Layout>
  )
}
export default Shop
