import React from 'react'
import { Link } from 'react-router-dom'
import firebase from 'firebase/app'

import cartContainer, { CartSubscriber } from 'containers/cartContainer'
import authContainer from 'containers/authContainer'
import Sessions from 'components/Sessions'
import Layout from 'components/Layout'

import styles from './styles.scss'

class Cart extends React.Component {
  constructor(props) {
    super(props)
  }

  checkout = () => {
    const { userId } = authContainer.state
  }

  render() {
    const { locationIds, items } = cartContainer

    return (
      <CartSubscriber>{() => (
        <Layout className={styles.transactionFeed}>
          <h1>Cart</h1>
          <h2>Selections</h2>

          <div>
            {locationIds.map(id => {
              const dates = cartContainer.getDates()

              return dates.map(date => (
                <Sessions key={date} date={date.date} locationId={id}>{(sessions) => {
                  return sessions
                  .filter(({ time }) => date.times.indexOf(time) > -1)
                  .map(({ id, isAvailable }) => (
                    <div 
                      className={styles.session} 
                      key={id} 
                      onClick={() => cartContainer.addItem(id)}
                    >
                      {id}
                      {!isAvailable && <h4>UNAVAILABLE</h4>} 
                    </div>
                  ))
                }}</Sessions>
              ))
            })}
          </div>

          <button onClick={this.checkout}>
            Checkout
          </button>
        </Layout>
      )}</CartSubscriber>
    )
  }
}

export default Cart