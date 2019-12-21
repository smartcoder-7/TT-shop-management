
import React, { useState } from 'react'
import { Form, Field } from 'react-final-form'
import modalContainer from 'containers/modalContainer';
import EmailField from 'components/fields/EmailField'

import styles from './styles.scss'
import authContainer from 'containers/authContainer';

const ResetForm = ({ email = '' }) => {
  const [error, setError] = useState()
  const onSubmit = async (values) => {

    try {
      await authContainer.resetPassword({ email: values.email })
    } catch (err) {
      setError(err.message)
      return
    }

    modalContainer.open({
      content: (
        <div data-row className={styles.reservationDetails}>
          <div data-col="1" />
          <div data-col="10">
            <p>Sent! Please try logging in again once you've reset your password via the automated link.</p>
          </div>
          <div data-col="1" />
        </div>
      )
    })
  }

  return (
    <div data-row className={styles.reservationDetails}>
      <div data-col="1" />
      <Form
        onSubmit={onSubmit}
        render={({ handleSubmit }) => (
          <form onSubmit={handleSubmit} data-col="10">
            {error && <div className={styles.formError}>
              {error}
            </div>}
            <div className={styles.fieldRow}>
              <EmailField
                name="email"
                label="Email"
                autoComplete="email"
                initialValue={email}
                required
              />
            </div>
            <button type="submit">Send Reset Password Link</button>
          </form>
        )}
      />
      <div data-col="1" />
    </div>
  )
}

const ResetPassword = ({ email = '', children }) => {
  const openModal = (e) => {
    e.preventDefault()
    modalContainer.open({
      content: <ResetForm email={email} />
    })
  }

  return (
    <>
      <button className={styles.resetPassword} data-link onClick={openModal}>
        {children}
      </button>
    </>
  )
}

export default ResetPassword
