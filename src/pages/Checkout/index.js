import React from 'react'
import { Link, withRouter } from 'react-router-dom'
import firebase from 'firebase/app'
import { Form, Field } from 'react-final-form'
import CreditCardField from 'components/fields/CreditCardField'

const functions = firebase.functions()
const addCard = functions.httpsCallable('addCustomerCard')

import cartContainer, { CartSubscriber } from 'containers/cartContainer'

import Layout from 'components/Layout'

import styles from './styles.scss'
import authContainer from '../../containers/authContainer';

class Checkout extends React.Component {
  constructor(props) {
    super(props)

    const { reservationIds } = props.location.state
  }

  componentDidMount() {
    this.paymentForm = new window.SqPaymentForm({
      // Initialize the payment form elements
      
      //TODO: Replace with your sandbox application ID
      applicationId: "sandbox-sq0idb-A9ivLdMr9IZyZ7QMfz8WbA",
      card: {
        elementId: 'sq-card',
      },

      callbacks: {
        cardNonceResponseReceived: (errors, card_nonce, paymentData, contacts) => {
          if (errors) {
        //   Log errors from nonce generation to the browser developer console.
            console.error('Encountered errors on card nonce received:');
            errors.forEach(function (error) {
              console.error('  ' + error.message);
            });
            alert('Encountered errors, check console for more details');
            return;
          }

          const customerId = authContainer.user.squareId

          if (!customerId) {
            throw Error('Invalid Square Customer Id')
          }
          
          addCard({ card_nonce, customerId })
        }
      }
    });

    this.paymentForm.build();
  }

  onSubmit = (event) => {
    event.preventDefault();
    // Request a nonce from the SqPaymentForm object
    this.paymentForm.requestCardNonce();
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
        </Layout>
      )}</CartSubscriber>
    )
  }
}

export default withRouter(Checkout)