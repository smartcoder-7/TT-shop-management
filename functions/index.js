const functions = require('firebase-functions')
const twilio = require('twilio')
const admin = require('firebase-admin')

// TODO: Swap out for production creds
const accountSid = functions.config().twilio.account_sid
const authToken = functions.config().twilio.auth_token

const client = twilio(accountSid, authToken)

const NUM_PINGPOD = '+16467936469'
const NUM_TO_DEFAULT = '+19175887518'

exports.requestAccessCode = functions.https.onCall(async (data = {}, context) => {
  const message = client.messages.create({
    body: data.message,
    from: NUM_PINGPOD,
    to: data.phone || NUM_TO_DEFAULT
  })

  return {
    message
  }
})

