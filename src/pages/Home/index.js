import React from 'react'
import { Link } from 'react-router-dom'
import Layout from 'components/Layout'
import Logo from 'components/Logo'

import styles from './styles.scss'

class Home extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Layout className={styles.home}>
        <div data-row>
          <div data-col="1"></div>
          <div className={styles.intro} data-col="10">
            <h1>
              <Logo className={styles.logo} theme="pink" />
              PINGPOD
            </h1>
            <p>
              The world’s first fully autonomous table tennis court system.
            </p>

            <Link to="/reserve/0" data-link>
              Reserve a Table
            </Link>
          </div>
          <div data-col="1"></div>
        </div>
      </Layout>
    )
  }
}

export default Home
