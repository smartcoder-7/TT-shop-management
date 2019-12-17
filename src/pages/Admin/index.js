import React, { useState, useEffect } from 'react'
import { Link, withRouter } from 'react-router-dom'
import qs from 'qs'

import Layout from 'components/Layout'
import Logo from 'components/Logo'
import LocationOverview from './LocationOverview'

import styles from './styles.scss'

const Admin = () => {
  return (
    <Layout className={styles.admin}>
      <div data-row="full">
        <div className={styles.intro} data-col={12}>
          <h1>
            <Logo className={styles.logo} theme="pink" />
            ADMIN
          </h1>

          <LocationOverview locationId="0" />

        </div>
      </div>
    </Layout>
  )
}

export default withRouter(Admin)
