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

const createOptions = ({ theme = 'dark' }) => {
  const dark = theme === 'dark'

  return {
    style: {
      base: {
        fontSize: '16px',
        color: dark ? '#424770' : '#ffffff',
        fontFamily: 'Avenir, sans-serif',
        '::placeholder': {
          color: dark ? '#aab7c4' : '#dddddd',
        },
      },
      invalid: {
        color: '#FF0078',
      },
    }
  }
};

const _CardForm = ({
  stripe,
  theme,
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
          <CardElement {...createOptions({ theme })} />
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

const CardForm = injectStripe(_CardForm)

const BillingModalContent = ({ theme }) => {
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
        <StripeProvider apiKey={process.env.STRIPE_PUBLISHABLE_KEY}>
          <Elements>
            <CardForm handleResult={handleResult} theme={theme} />
          </Elements>
        </StripeProvider>
      </div>
      <div data-col="1" />
    </div>
  )
}

const openBillingModal = ({ theme }) => {
  modalContainer.open({
    content: <BillingModalContent theme={theme} />
  })
}

const UpdateBillingInfo = ({ theme, children }) => {
  return children({ onClick: () => openBillingModal({ theme }) })
}

export default UpdateBillingInfo

