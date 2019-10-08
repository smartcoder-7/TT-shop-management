import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Form } from 'react-final-form'
import Layout from 'components/Layout'
import firebase from 'util/firebase'

import styles from './styles.scss'
import authContainer, { AuthSubscriber } from '../../containers/authContainer'
import { ReservationRange } from 'components/Reservation'
import { INTERVAL_MS } from 'util/getPodSessions'
import getDateParts from 'shared/getDateParts'
import BillingInfo from './BillingInfo';
import TextField from '../fields/TextField';
import { updateUser } from 'util/db';

const functions = firebase.functions()
const getCustomer = functions.httpsCallable('getCustomer')

const Card = ({
  card_brand,
  last_4,
  exp_month,
  exp_year
}) => {
  return (
    <div>
      {card_brand} {last_4}
    </div>
  )
}

class AccountInfo extends React.Component {
  state = {
    loading: true,
  }

  constructor(props) {
    super(props)
  }

  render() {
    const { loading, cards } = this.state

    return (
      <div className={styles.billingInfo}>
        <AuthSubscriber>{() => {
          const { user, userId } = authContainer

          const onSubmit = ({ firstName = '', lastName = '' }) => {
            // Update user!
            updateUser(userId, { firstName, lastName })
          }

          return (
            <div>
              <Form
                onSubmit={onSubmit}
                render={({ 
                  handleSubmit, 
                  dirty,
                  submitSucceeded,
                  dirtySinceLastSubmit, 
                }) => {
                  const shouldSave = submitSucceeded ? dirtySinceLastSubmit : dirty
                  
                  return (
                    <div data-row>
                      <form onSubmit={handleSubmit} data-col="12">
                        <section className={styles.accountInfo}>
                          <div data-row className={styles.fieldRow}>
                            <div data-col="6" className={styles.field}>
                              <TextField name="firstName" initialValue={user.firstName} label="First Name" />
                            </div>
                            <div data-col="6" className={styles.field}>
                              <TextField name="lastName" initialValue={user.lastName} label="Last Name" />
                            </div>
                          </div>
                          {shouldSave && <button data-size="small" data-plain className={styles.save}>Save Changes</button>}
                        </section>
                      </form>
                    </div>
                  )
                }}
              />

              <BillingInfo />
            </div>
          )
        }}</AuthSubscriber>
      </div>
    )
  }
}

export default AccountInfo