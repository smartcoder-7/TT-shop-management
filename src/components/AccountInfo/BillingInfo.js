import React, { useState, useEffect } from 'react'
import firebase from 'util/firebase'
import { 
  CardElement,
  injectStripe,
  StripeProvider,
  Elements,
} from 'react-stripe-elements';

import { updateUserBilling, getUserBilling } from 'api'
import styles from './styles.scss'
import authContainer, { AuthSubscriber } from 'containers/authContainer'
import Loading from 'components/Loading'
import { NewCard, Card } from './Card'
import { updateUser } from 'util/db'
import FieldWrapper from 'components/fields/FieldWrapper'

const functions = firebase.functions()
const getCustomer = functions.httpsCallable('getCustomer')

const AddCard = ({ stripe, handleResult }) => {
  const handleSubmit = (e) => {
    e.preventDefault()

    if (!stripe) {
      console.error('Stripe has not loaded.')
      return
    }

    stripe.createToken().then(handleResult);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          <CardElement
            // {...createOptions()}
          />
        </label>
        <div className="error" role="alert">
          {/* {this.state.errorMessage} */}
        </div>
        <button>Update Card</button>
      </form>
    </div>
  )
}

const CardForm = injectStripe(AddCard)

const BillingInfo = () => {
  const [userBilling, setUserBilling] = useState()
  const { user } = authContainer

  useEffect(() => {
    getUserBilling({ userId: user.id })
    .then(data => setUserBilling(data))
  }, [user.id])

  const handleResult = ({ token, error }) => {
    updateUserBilling({
      userId: user.id,
      customerId: user.stripeId,
      token,
    }).catch(err => {
      console.log(err)
    })
  }

  const cards = userBilling ? userBilling.sources.data : []
  const defaultCard = cards[0]

  console.log(userBilling)

  return (
    <div className={styles.billingInfo}>
      <div className={styles.cards}>
        <Loading loading={!userBilling} />
        {userBilling && !cards.length && 'No cards saved.'}
        {defaultCard && <Card 
          {...defaultCard} 
          key={defaultCard.id} 
        />}
      </div>

      <StripeProvider apiKey={process.env.STRIPE_PUBLISHABLE_KEY}>
        <Elements>
          <CardForm handleResult={handleResult} />
        </Elements>
      </StripeProvider>
    </div>
  )
}

export default () => (
  <AuthSubscriber>{() => (
    <BillingInfo />
  )}</AuthSubscriber>
)