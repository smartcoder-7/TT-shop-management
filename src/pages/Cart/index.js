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
import GroupedSessions from '../../components/Sessions/GroupedSessions';

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
    const { user } = authContainer

    const canCheckout = (
      user.firstName &&
      user.lastName &&
      user.squareId && 
      user.activeCard
    )

    return (
      <CartSubscriber>{() => {
        console.log('rerender')
        const { locationIds, items } = cartContainer
        const canContinue = (
          step < 1 && 
          !!locationIds.length &&
          items.length > 0
        )

        console.log(cartContainer.sessions)
    
        console.log(canContinue)
    
        return (
          <Layout className={styles.cart}>
            <h1>Cart</h1>

            <div className={styles.step}>
              <h3 className={styles.header}>1. Confirm Selection</h3>

              <div data-row>
                <div data-col="12">
                  {!items.length && 'No sessions selected.'}
                  <GroupedSessions sessions={cartContainer.sessions} inCart={true} />
                </div>
              </div>
            </div>

            <div>
              <Link to="/reserve/0" data-link>
                + Add more sessions
              </Link>
            </div>

            <br />

            {canContinue && (
              <button 
                data-size="small" 
                onClick={() => this.setState({ step: 1 })}
              >
                Continue
              </button>
            )}

            {step > 0 && (
              <div className={styles.step}>
                <h3 className={styles.header}>2. Add/Update Account Info</h3>
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
        )
      }}</CartSubscriber>
    )
  }
}

export default withRouter(Cart)