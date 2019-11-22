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
        <>
          <h1>Choose a Location</h1>
          <Link to="/reserve/0">
            <button>NYC</button>
          </Link>

        </>
      </Layout>
    )
  }
}

export default Account
