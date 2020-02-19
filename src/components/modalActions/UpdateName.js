import React, { useState } from 'react'
import { Form } from 'react-final-form'

import TextField from 'components/fields/TextField'
import styles from './styles.scss'
import { updateUser, constants } from 'api'
import authContainer from 'containers/authContainer'
import modalContainer from 'containers/modalContainer'

const ModalContent = ({ theme }) => {
  const { user } = authContainer

  const onSubmit = ({ firstName, lastName }) => {
    updateUser({
      id: authContainer.userId,
      firstName,
      lastName
    })
      .then(() => {
        modalContainer.close()
      })
  }

  return (
    <div data-row>
      <div data-col="1" />
      <div data-col="10">
        <p data-p3>Please enter the name that matches your goverment-issued ID.</p>
        <Form
          onSubmit={onSubmit}
          render={({ handleSubmit, values, ...rest }) => console.log(rest) || (
            <form onSubmit={handleSubmit}>
              <div data-field-row>
                <TextField name="firstName" label="First Name" autoComplete="given-name" required />
              </div>
              <div data-field-row>
                <TextField name="lastName" label="Last Name" autoComplete="family-name" required />
              </div>
              <button type="submit">Submit</button>
            </form>
          )}
        />
      </div>
      <div data-col="1" />
    </div>
  )
}

const openModal = ({ theme }) => {
  modalContainer.open({
    content: <ModalContent theme={theme} />
  })
}

const UpdateBillingInfo = ({ theme, children }) => {
  return children({ onClick: () => openModal({ theme }) })
}

export default UpdateBillingInfo

