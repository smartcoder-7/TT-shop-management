import React from 'react'
import { Link, withRouter } from 'react-router-dom'
import firebase from 'firebase/app'
import { Form, Field } from 'react-final-form'
import CreditCardField from 'components/fields/CreditCardField'

const functions = firebase.functions()
const addCard = functions.httpsCallable('createCustomerCard')

import cartContainer, { CartSubscriber } from 'containers/cartContainer'

import Layout from 'components/Layout'

import styles from './styles.scss'

class Checkout extends React.Component {
  constructor(props) {
    super(props)

    const { reservationIds } = props.location.state

    console.log(reservationIds)
  }

  onSubmit = (event) => {
    console.log('nothin')
    event.preventDefault();
    // Request a nonce from the SqPaymentForm object
    paymentForm.requestCardNonce();
  }

  render() {
    return (
      <CartSubscriber>{() => (
        <Layout className={styles.transactionFeed}>
          <h1>Cart</h1>
          <h2>CHECKOUT</h2>

          <div id="form-container" >
            <div id="sq-card"></div>
            <button class="button-credit-card" onClick={this.onSubmit}>Pay</button>
          </div>

          <div>
            <Form
              onSubmit={this.onSubmit}
              render={({ handleSubmit }) => (
                <div data-row>
                  <form onSubmit={handleSubmit} data-col="12">
                    <CreditCardField name="card-number" label="Card Number" autoComplete="cc-number" />
                    <button type="submit">Pay</button>
                  </form>
                </div>
              )}
            />
          </div>
        </Layout>
      )}</CartSubscriber>
    )
  }
}

export default withRouter(Checkout)