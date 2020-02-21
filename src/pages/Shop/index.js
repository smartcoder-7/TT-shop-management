import React, { useState, useEffect } from 'react'

import authContainer from 'containers/authContainer'
import Layout from 'components/Layout'
import ProductPicker from 'components/ProductPicker'

import styles from './styles.scss'


const Shop = ({ }) => {
  const userId = authContainer.userId

  return (
    <Layout className={styles.shop}>
      <div data-row>
        <div data-col="12" >
          <div className={styles.header}>
            <span data-label>Shop</span>
          </div>

          <ProductPicker onPurchase={() => modalContainer.close()} userId={userId} />
        </div>
      </div>
    </Layout>
  )
}
export default Shop
