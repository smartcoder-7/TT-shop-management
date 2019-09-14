import React from 'react'
import { Link, withRouter } from 'react-router-dom'
import firebase from 'firebase/app'
import { Form, Field } from 'react-final-form'
import visaSvg from 'payment-icons/min/flat/visa.svg'
import mastercardSvg from 'payment-icons/min/flat/mastercard.svg'


import CreditCardField from 'components/fields/CreditCardField'

const functions = firebase.functions()
const addCard = functions.httpsCallable('addCustomerCard')

import cartContainer, { CartSubscriber } from 'containers/cartContainer'

import Layout from 'components/Layout'

import styles from './styles.scss'
import authContainer from '../../containers/authContainer';

const SQUARE_PAYMENT_CONFIG = {
  applicationId: "sandbox-sq0idb-A9ivLdMr9IZyZ7QMfz8WbA",
  card: {
    elementId: 'sq-card',
  },
}

const ICONS = {
  VISA: visaSvg,
  MASTERCARD: mastercardSvg,
}

export const Card = ({
  card_brand,
  last_4,
  isActive,
  onClick
}) => (
  <div className={styles.card} onClick={onClick} data-is-active={isActive}>
    {ICONS[card_brand] && (
      <span className={styles.cardBrand} dangerouslySetInnerHTML={{__html: ICONS[card_brand]}} />
    )}
    <span data-label>
      {last_4}
    </span>

    <span style={{marginLeft: 'auto'}} data-label>
      {isActive && 'Active Card'}
    </span>
  </div>
)

class NewCard extends React.Component {
  state = {
    submitting: false,
    expanded: false
  }
  
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    const { onAdd } = this.props

    if (!window.SqPaymentForm) {
      console.log('Error loading Square.')
      return
    }

    this.paymentForm = new window.SqPaymentForm({
      ...SQUARE_PAYMENT_CONFIG,
      callbacks: {
        cardNonceResponseReceived: (errors, card_nonce, paymentData, contacts) => {
          if (errors) {
            errors.forEach((error) => {
              console.error('[SQUARE CARD_NONCE REQUEST ERROR]' + error.message)
            })

            return
          }

          const customerId = authContainer.user.squareId

          if (!customerId) {
            throw Error('Invalid Square Customer Id')
          }
          
          addCard({ card_nonce, customerId })
          .then(({ data = {} }) => {
            this.setState({ submitting: false, expanded: false })
            authContainer.triggerChange()
            onAdd(data.card)
          })
        }
      }
    });

    this.paymentForm.build()
  }

  onSubmit = (event) => {
    event.preventDefault()

    this.setState({ submitting: true })
    // Request a nonce from the SqPaymentForm object
    this.paymentForm.requestCardNonce()
  }

  render() {
    const { submitting, expanded } = this.state

    return (
      <div className={styles.newCard}>
        {!expanded && (
          <button data-plain data-link onClick={() => this.setState({ expanded: true })}>
            + Add a new card
          </button>
        )}

        {expanded && (
          <button data-plain data-link onClick={() => this.setState({ expanded: false })}>
            - Collapse
          </button>
        )}
        
        <div className={styles.newCardForm} data-expanded={expanded}>
          <div id="sq-card"></div>
          <button 
            data-size="small" 
            className="button-credit-card" 
            onClick={this.onSubmit}
            disabled={submitting}
          >
            {submitting ? 'Processing...' : 'Save'}
          </button>
        </div>
      </div>
    )
  }
}

export { NewCard }