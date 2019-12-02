import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

import {
  CardElement,
  injectStripe,
  StripeProvider,
  Elements,
} from 'react-stripe-elements'
import styles from './styles.scss'
import { updateUserBilling, getUserBilling, constants } from 'api'
import authContainer from 'containers/authContainer'
import modalContainer from 'containers/modalContainer';

const createOptions = () => {
  return {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        fontFamily: 'Avenir, sans-serif',
        letterSpacing: '0.025em',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#c23d4b',
      },
    }
  }
};

const AddCard = ({
  stripe,
  handleResult
}) => {
  console.log('check', stripe)
  const handleSubmit = (e) => {
    e.preventDefault()

    if (!stripe) {
      console.error('Stripe has not loaded.')
      return
    }

    stripe.createToken().then(handleResult)
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          <CardElement
            {...createOptions()}
          />
        </label>
        <div className="error" role="alert">
          {/* {this.state.errorMessage} */}
        </div>
        <button data-link>Update Card</button>
      </form>
    </div>
  )
}

const CardForm = injectStripe(AddCard)

const BillingModalContent = () => {
  const { user } = authContainer

  const handleResult = ({
    token,
    error
  }) => {
    updateUserBilling({
      userId: user.id,
      customerId: user.stripeId,
      token,
    })
      .then(data => {
        authContainer.triggerChange()
        modalContainer.close()
      })
      .catch(err => {
        console.log(err)
      })
  }

  return (
    <div data-row>
      <div data-col="1" />
      <div data-col="10">
        <StripeProvider apiKey={constants.STRIPE_PUBLISHABLE_KEY}>
          <Elements>
            <CardForm handleResult={handleResult} />
          </Elements>
        </StripeProvider>
      </div>
      <div data-col="1" />
    </div>
  )
}

const openBillingModal = () => {
  modalContainer.open({
    content: <BillingModalContent />
  })
}

const UserActions = () => {
  return (
    <>
      <button className={styles.tableRates} data-link onClick={openBillingModal}>
        + Update Billing Info
      </button>

      <Link to="/reserve" data-link>
        + Book another table
      </Link>
    </>
  )
}


export default UserActions
