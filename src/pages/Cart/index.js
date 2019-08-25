import React from 'react'
import { Link } from 'react-router-dom'
import firebase from 'firebase/app'

import cartContainer, { CartSubscriber } from 'containers/cartContainer'
import authContainer from 'containers/authContainer'
import Sessions from 'components/Sessions'
import { CartSession } from 'components/Session'
import Layout from 'components/Layout'
import { parseSession } from 'util/getPodSessions'
import makeReservations from 'util/makeReservations'

import styles from './styles.scss'

class Cart extends React.Component {
  state = {
    submissionError: ''
  }

  constructor(props) {
    super(props)
  }

  componentWillUnmount() {
    this.isUnmounted = true
  }

  checkout = () => {
    const { userId } = authContainer.state
    const sessionIds = cartContainer.items

    if (!sessionIds || !sessionIds.length) {
      this.setState({
        submissionError: 'No sessions selected.'
      })

      return
    }

    const onUnavailable = (sessionId) => {
      // Show unavailable items for a few seconds so they can see which
      // ones got booked up.
      setTimeout(() => {
        cartContainer.removeItem(sessionId)
      }, 2000)
    }

    console.log('TRYING TO RESERVE', userId, sessionIds)
    makeReservations({ sessionIds, userId, onUnavailable })
    .then(() => {
      console.log('SUCCESS!')
      // TODO: Replace with Checkout payment flow.
      window.location = '/account'
    })
    .catch((err) => {
      if (this.isUnmounted) return

      this.setState({
        submissionError: err
      })
    })
  }

  render() {
    const { submissionError } = this.state
    const { locationIds, items } = cartContainer

    return (
      <CartSubscriber>{() => (
        <Layout className={styles.cart}>
          <h1>Cart</h1>
          <h2>Selections</h2>

          <div data-row>
            <div data-col="12">
              {locationIds.map(id => {
                const dates = cartContainer.getDates()
                console.log(dates)

                return dates.map(date => (
                  <Sessions 
                    key={date.date} 
                    date={date.date} 
                    locationId={id}
                  >{(sessions) => {
                    return sessions
                    .filter(({ id }) => date.sessions.indexOf(id) > -1)
                    .map(({ id, isAvailable }) => (
                      <CartSession 
                        id={id}
                        isAvailable={isAvailable}
                        className={styles.session} 
                        key={id} 
                        onXClick={() => cartContainer.removeItem(id)}
                      />
                    ))
                  }}</Sessions>
                ))
              })}
            </div>
          </div>

          <button onClick={this.checkout}>
            Checkout
          </button>
          {submissionError && (
            <span>{submissionError}</span>
          )}
        </Layout>
      )}</CartSubscriber>
    )
  }
}

export default Cart