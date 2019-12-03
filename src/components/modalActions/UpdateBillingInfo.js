import React, { useState } from 'react'

import {
  CardElement,
  injectStripe,
  StripeProvider,
  Elements,
} from 'react-stripe-elements'
import styles from './styles.scss'
import { updateUserBilling, constants } from 'api'
import authContainer from 'containers/authContainer'
import modalContainer from 'containers/modalContainer'

const createOptions = () => {
  return {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        fontFamily: 'Avenir, sans-serif',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#FF0078',
      },
    }
  }
};

const AddCard = ({
  stripe,
  handleResult
}) => {
  const [formError, setFormError] = useState()
  const handleSubmit = (e) => {
    e.preventDefault()

    if (!stripe) {
      console.error('Stripe has not loaded.')
      return
    }

    stripe.createToken().then(({ token, error }) => {
      if (error) {
        setFormError(error.message)
        return
      }

      handleResult(token)
    })
  }

  return (
    <div>
      <h3>Update Billing Info</h3>
      <p data-p3>This is the credit card that will be used when booking tables.</p>

      <form onSubmit={handleSubmit}>
        <div className={styles.cardForm}>
          <CardElement {...createOptions()} />
        </div>

        {formError && (
          <label className={styles.cardError} data-error role="alert">
            {formError}
          </label>
        )}

        <button data-link>Save</button>
      </form>
    </div>
  )
}

const CardForm = injectStripe(AddCard)

const BillingModalContent = () => {
  const { user } = authContainer

  const handleResult = (token) => {
    updateUserBilling({
      userId: user.id,
      customerId: user.stripeId,
      token,
    })
      .then(() => {
        authContainer.updateUserBilling()
        modalContainer.close()
      })
      .catch(err => {
        throw err
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

const UpdateBillingInfo = ({ children }) => {
  return children({ onClick: openBillingModal })
}

export default UpdateBillingInfo

