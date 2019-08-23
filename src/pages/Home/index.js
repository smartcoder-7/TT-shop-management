import React from 'react'
import { Link } from 'react-router-dom'
import Layout from 'components/Layout'

import styles from './styles.scss'

class Home extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Layout className={styles.transactionFeed}>
        <h1>Home</h1>

        <Link to="/reserve/0">
          <button>Reserve a Table</button>
        </Link>
      </Layout>
    )
  }
}

export default Home
