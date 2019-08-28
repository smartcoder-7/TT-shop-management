const functions = require('firebase-functions')
const twilio = require('twilio')
const cors = require('cors')({ origin: true })
const admin = require('firebase-admin')

// TODO: Swap out for production creds
const accountSid = 'AC9fa3545209cb1afa1ef53979950d1c20'
const authToken = '2027bbf281033475bdc1314ab7f6c768'

const client = twilio(accountSid, authToken)

const NUM_PINGPOD = '+16467936469'
const NUM_TO_DEFAULT = '+19175887518'

exports.requestAccessCode = functions.https.onCall(async (data, context) => {
  const { email } = context.auth.token
  const body = `Welcome to PINGPOD, ${email}. Your access code is: 105839`

  const message = client.messages.create({
    body,
    from: NUM_PINGPOD,
    to: data.phone || NUM_TO_DEFAULT
  })

  return {
    message
  }
})

