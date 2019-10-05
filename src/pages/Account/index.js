import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Layout from 'components/Layout'

import styles from './styles.scss'
import authContainer, { AuthSubscriber } from 'containers/authContainer'
import AccountInfo from 'components/AccountInfo'
import GroupedSessions from 'components/Sessions/GroupedSessions'


class Account extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {    
    return (
      <Layout className={styles.account}>
        <AuthSubscriber>{() => {
          const { user } = authContainer

          return (
            <>
              <h1>Account</h1>
              
              <AccountInfo />

              <div>
                <h1>Reservations</h1>
                <br />
                <div data-row>
                  <div data-col="12">
                    <GroupedSessions sessions={authContainer.user.reservations} />
                  </div>
                </div>
              </div>

              <Link to="/reserve/0">
                <button>Reserve another Table</button>
              </Link>
            </>
          )
        }}</AuthSubscriber>
      </Layout>
    )
  }
}

export default Account
