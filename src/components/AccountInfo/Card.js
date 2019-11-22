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
  Visa: visaSvg,
  MasterCard: mastercardSvg,
}

export const Card = ({
  brand,
  last4,
  isActive,
  onClick
}) => (
  <div className={styles.card} onClick={onClick} data-is-active={isActive}>
    {ICONS[brand] && (
      <span className={styles.cardBrand} dangerouslySetInnerHTML={{__html: ICONS[brand]}} />
    )}
    <span data-label>
      {last4}
    </span>
  </div>
)