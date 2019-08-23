import React from 'react'
import { Link } from 'react-router-dom'
import Layout from 'components/Layout'

import styles from './styles.scss'

class Account extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Layout className={styles.account}>
        <h1>Account</h1>

        <div>
          <h2>My Reservations</h2>
          --- COMING SOON ---
        </div>

        <Link to="/reserve/0">
          <button>Reserve another Table</button>
        </Link>
      </Layout>
    )
  }
}

export default Account
