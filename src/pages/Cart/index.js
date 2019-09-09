import React from 'react'
import { Link, withRouter } from 'react-router-dom'
import firebase, { auth } from 'firebase/app'

import cartContainer, { CartSubscriber } from 'containers/cartContainer'
import authContainer from 'containers/authContainer'
import Sessions from 'components/Sessions'
import { CartSession } from 'components/Session'
import Layout from 'components/Layout'
import { parseSession } from 'util/getPodSessions'
import makeReservations, { validateReservations } from 'util/makeReservations'

import styles from './styles.scss'
import AccountInfo from 'components/AccountInfo';

class Cart extends React.Component {
  state = {
    submissionError: '',
    step: 0
  }

  constructor(props) {
    super(props)
  }

  componentDidMount() {
    const { userId } = authContainer.state
    const sessionIds = cartContainer.items

    validateReservations({ sessionIds, userId, onUnavailable: this.onUnavailable })
    .catch((err) => {
      if (this.isUnmounted) return

      this.setState({
        submissionError: err
      })
    })
  }

  componentWillUnmount() {
    this.isUnmounted = true
  }

  onUnavailable = (sessionId) => {
    // Show unavailable items for a few seconds so they can see which
    // ones got booked up.
    setTimeout(() => {
      cartContainer.removeItem(sessionId)
    }, 2000)
  }

  checkout = () => {
    const { userId, user } = authContainer.state
    const sessionIds = cartContainer.items
    const { history } = this.props

    if (!sessionIds || !sessionIds.length) {
      this.setState({
        submissionError: 'No sessions selected.'
      })

      return
    }

    if (!user.firstName || !user.lastName) {
      this.setState({
        submissionError: 'Missing account information.'
      })

      return
    }

    if (!user.activeCard) {
      this.setState({
        submissionError: 'Missing active card.'
      })

      return
    }

    console.log('TRYING TO RESERVE', userId, sessionIds)
    makeReservations({ sessionIds, userId, onUnavailable: this.onUnavailable })
    .then(() => {
      console.log('SUCCESS!')
      history.push('/account')
    })
    .catch((err) => {
      if (this.isUnmounted) return

      this.setState({
        submissionError: err
      })
    })
  }

  render() {
    const { submissionError, step } = this.state
    const { locationIds, items } = cartContainer
    const { user } = authContainer

    const canCheckout = (
      user.firstName &&
      user.lastName &&
      user.squareId && 
      user.activeCard
    )

    return (
      <CartSubscriber>{() => (
        <Layout className={styles.cart}>
          <h1>Cart</h1>

          <div className={styles.step}>
            <h3>1. Confirm Selection</h3>

            <div data-row>
              <div data-col="12">
                {!locationIds.length && 'No sessions selected.'}
                {locationIds.map(id => {
                  const dates = cartContainer.getDates()

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
          </div>

          <div>
            <Link to="/reserve/0" data-link>
              + Add sessions
            </Link>
          </div>

          <br />

          {step < 1 && !!locationIds.length && (
            <button 
              data-size="small" 
              onClick={() => this.setState({ step: 1 })}
            >
              Continue
            </button>
          )}

          {step > 0 && (
            <div className={styles.step}>
              <h3>2. Add/Update Account Info</h3>
              <AccountInfo />

              <button onClick={this.checkout} disabled={!canCheckout}>
                Checkout
              </button>
            </div>
          )}


          {submissionError && (
            <div>{submissionError}</div>
          )}
        </Layout>
      )}</CartSubscriber>
    )
  }
}

export default withRouter(Cart)