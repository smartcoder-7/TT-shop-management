import firebase from 'firebase/app'
import React, { useState, useEffect } from 'react'
import { Form } from 'react-final-form'
import axios from 'axios'
import authContainer, { AuthSubscriber } from '../../containers/authContainer'
import { AccountSession } from '../../components/Session'
import PhoneField from 'components/fields/PhoneField'

const functions = firebase.functions()
const requestAccessCode = functions.httpsCallable('requestAccessCode')

// functions.useFunctionsEmulator('http://localhost:5000') 


const RequestAccess = ({ id }) => {
  const [error, setError] = useState()

  const onSubmit = ({ phone }) => {
    if (!phone) {
      setError('Please enter a phone number.')
      return
    }

    console.log('request', phone)
    requestAccessCode({ phone })
    .then(result => {
      // Read result of the Cloud Function.
      var sanitizedMessage = result
      console.log('res', result)
      // ...
      setError()
    })
    .catch(err => {
      console.log(err)
      setError(err)
    })
  }

  return (
    <>
      <Form
        onSubmit={onSubmit}
        render={({ handleSubmit }) => (
          <div data-row>
            <form onSubmit={handleSubmit} data-col="12">
              <PhoneField name="phone" label="Mobile Number" autoComplete="tel" />
              <button type="submit">Submit</button>
              {error && <span>{error}</span>}
            </form>
          </div>
        )}
      />
    </>
  )
}

export default RequestAccess