import React from 'react'
import { Link, withRouter } from 'react-router-dom'
import qs from 'qs'

import Layout from 'components/Layout'
import Logo from 'components/Logo'
import EmailSubscribe from 'components/EmailSubscribe'

import styles from './styles.scss'
import contextContainer from 'containers/contextContainer'

const IS_DEV = process.env.NODE_ENV === 'development'

class Admin extends React.Component {
  scrollRef = React.createRef()

  state = {}

  constructor(props) {
    super(props)

  }

  render() {
    return (
      <Layout className={styles.home}>
        <div data-row>
          <div className={styles.intro} data-col="12">
            <h1>
              <Logo className={styles.logo} theme="pink" />
              PINGPOD ADMIN
            </h1>


          </div>
        </div>
      </Layout>
    )
  }
}

export default withRouter(Admin)
