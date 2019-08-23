import React from 'react'
import { Link } from 'react-router-dom'
import firebase from 'firebase/app'

import cartContainer, { CartSubscriber } from 'containers/cartContainer'

import Layout from 'components/Layout'

import styles from './styles.scss'

class Checkout extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <CartSubscriber>{() => (
        <Layout className={styles.transactionFeed}>
          <h1>Cart</h1>
          <h2>CHECKOUT</h2>

          <div>
            
          </div>

          <button>
            Pay
          </button>
        </Layout>
      )}</CartSubscriber>
    )
  }
}

export default Checkout