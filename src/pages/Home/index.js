import React from 'react'
import { Link } from 'react-router-dom'
import Layout from 'components/Layout'
import Logo from 'components/Logo'
import EmailSubscribe from 'components/EmailSubscribe'

import styles from './styles.scss'

class Home extends React.Component {
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
              PINGPOD
            </h1>
            <p>
              The world’s first fully autonomous table tennis court system.
            </p>

            <Link to="/reserve/0" data-link>
              Reserve a Table
            </Link>
          </div>
        </div>

        <br />
        <br />
        <br />
        <br />
        <br />
        <br />

        <div data-row>
          <div data-col="12" data-col-landscape="6">
            <br />
            <br />
            <h2>How It Works</h2>
            <br />
            <p>
              Download the PingPod app to get quick, easy access to a premium table tennis experience. All you have to do is choose a time, add your payment information, and show up at the&nbsp;door.
            </p>
          </div>
          <div data-col="0" data-col-landscape="6" data-landscape-only>
            <img src="/assets/mobile-screenshot-01.png" />
          </div>
        </div>

        <br />
        <br />
        <br />
        <br />
        <br />

        <div data-row>
          <div data-col="0" data-col-landscape="3"></div>
            <div data-col="12" data-col-landscape="6">
              <h2>Get Early Access</h2>
              <br />
              <p>
                PingPod launches in New York City in December 2019. Sign up with your email to be part of our exclusive beta user&nbsp;list.
              </p>
              <br />

                <EmailSubscribe />
            </div>
          <div data-col="0" data-col-landscape="3"></div>
        </div>
      </Layout>
    )
  }
}

export default Home
