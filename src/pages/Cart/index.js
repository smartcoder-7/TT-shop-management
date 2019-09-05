import React from 'react'
import { Link, withRouter } from 'react-router-dom'
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

  componentDidMount() {
    // TODO: Validate cart items.
  }

  componentWillUnmount() {
    this.isUnmounted = true
  }

  checkout = () => {
    const { userId } = authContainer.state
    const sessionIds = cartContainer.items
    const { history } = this.props

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
    .then((reservationIds = []) => {
      console.log('SUCCESS!')
      // cartContainer.empty()
      // TODO: Replace with Checkout payment flow.

      // grab reservation ids. On offline, timeout, or unload, RELEASE reservations

      const cancel = () => {
        console.log('CANCEL')
      }

      setTimeout(cancel, 1000 * 60 * 20)

      history.push('/checkout', { reservationIds })
      // window.location = '/checkout'
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

export default withRouter(Cart)