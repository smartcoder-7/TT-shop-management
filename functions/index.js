const functions = require('firebase-functions')
const twilio = require('twilio')
const admin = require('firebase-admin')

// TODO: Swap out for production creds
const accountSid = functions.config().twilio.account_sid
const authToken = functions.config().twilio.auth_token

const twilioClient = twilio(accountSid, authToken)

const NUM_PINGPOD = '+16467936469'
const NUM_TO_DEFAULT = '+19175887518'

exports.requestAccessCode = functions.https.onCall(async (data = {}, context) => {
  const message = twilioClient.messages.create({
    body: data.message,
    from: NUM_PINGPOD,
    to: data.phone || NUM_TO_DEFAULT
  })

  return {
    message
  }
})

const SquareConnect = require('square-connect')
const squareClient = SquareConnect.ApiClient.instance

// Configure OAuth2 access token for authorization: oauth2
const oauth2 = squareClient.authentications['oauth2']
oauth2.accessToken = functions.config().square.access_token_dev

const customersApi = new SquareConnect.CustomersApi()

exports.createCustomer = functions.https.onCall(async (data = {}, context) => {

  /* Creates a new customer for a business, which can have associated cards on file. 
  You must provide at least one of the following values in your request to this endpoint: 
  - `given_name` 
  - `family_name` 
  - `company_name` 
  - `email_address` 
  - `phone_number`
  */
  const body = new SquareConnect.CreateCustomerRequest({
    email_address: 'test@test.com'
  })

  customersApi.createCheckout(body)
  .then(data => {
    console.log('API called successfully. Returned data: ' + JSON.stringify(data, 0, 1));
  }, error => {
    console.error(error);
  });
})


exports.getCustomer = functions.https.onCall(async (data = {}, context) => {
  customersApi.retrieveCustomer(customerId)
  .then(data => {
    
  })
})
