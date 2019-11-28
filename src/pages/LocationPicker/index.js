import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Layout from 'components/Layout'
import locations from '../../../locations.json'

import styles from './styles.scss'
import authContainer, { AuthSubscriber } from 'containers/authContainer'
import AccountInfo from 'components/AccountInfo'


class Account extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Layout className={styles.account}>
        <div data-row className={styles.details}>
          <div data-col={12}>
            <h1>Choose a Location</h1>

            <div className={styles.locations}>
              {Object.keys(locations).map(key => {
                const location = locations[key]

                return (
                  <Link to={`/reserve/${key}`} key={key}>
                    <div className={styles.location}>
                      <h2>{location.displayName}</h2>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </Layout>
    )
  }
}

export default Account
