import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Form } from 'react-final-form'
import Layout from 'components/Layout'
import firebase from 'util/firebase'

import styles from './styles.scss'
import authContainer, { AuthSubscriber } from '../../containers/authContainer'
import { INTERVAL_MS } from 'util/getPodSessions'
import getDateParts from 'util/getDateParts'
import BillingInfo from './BillingInfo'
import TextField from '../fields/TextField'
import { updateUserInfo } from 'api'

const AccountInfo = () => {
  const { user } = authContainer

  const onSubmit = ({
    firstName = '', lastName = ''
  }) => {
    // Update user!
    updateUserInfo({
      userId: user.id,
      firstName,
      lastName
    }).then(() => {
      console.log('heyo')
    })
  }

  return (
    <div className={styles.billingInfo}>
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
              <form onSubmit={handleSubmit}>
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
            )
          }}
        />

        <BillingInfo />
      </div>
    </div>
  )
}

export default AccountInfo