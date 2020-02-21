import React, { useState, useEffect } from 'react'

import authContainer from 'containers/authContainer'
import Layout from 'components/Layout'
import ProductPicker from 'components/ProductPicker'

import styles from './styles.scss'


const Now = ({ }) => {
  const userId = authContainer.userId

  return (
    <Layout className={styles.shop}>
      <div data-row>
        <div data-col="12" >
          <div className={styles.header}>
            <span data-label>Page Coming Soon</span>
          </div>
        </div>
      </div>
    </Layout>
  )
}
export default Now
