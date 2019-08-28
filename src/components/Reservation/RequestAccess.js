import firebase from 'firebase/app'
import React, { useState, useEffect } from 'react'
import { Form } from 'react-final-form'
import { formatTime, formatDate } from 'util/getPodSessions';
import PhoneField from 'components/fields/PhoneField'

const functions = firebase.functions()
const requestAccessCode = functions.httpsCallable('requestAccessCode')

// For dev
// functions.useFunctionsEmulator('http://localhost:5000') 

const RequestAccess = ({ start, end, reservation }) => {
  const [error, setError] = useState()

  const onSubmit = ({ phone }) => {
    if (!phone) {
      setError('Please enter a phone number.')
      return
    }

    const message = `Welcome to PINGPOD. 
Your access code is 123456.

This code is valid at: 
Location ${reservation.locationId}
${reservation.date}
${formatTime(start)} - ${formatTime(end)}`

    requestAccessCode({ phone, message })
    .then(result => {
      // Read result of the Cloud Function.
      var sanitizedMessage = result
      console.log('res', result)
      // ...
      setError('Success! Sent to your phone.')
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
          <div>
            <h1>You're booked!</h1>
            <h4>{formatTime(start)} - {formatTime(end)}</h4>
            <br />

            <p>Enter your mobile number to receive your access code.</p>
            <br />
            <form onSubmit={handleSubmit}>
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