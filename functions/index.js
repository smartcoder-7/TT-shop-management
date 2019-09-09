const functions = require('firebase-functions')
const twilio = require('twilio')
const admin = require('firebase-admin')
const uuid = require( 'uuid')

const config = functions.config()

// TODO: Swap out for production creds
// const accountSid = config.twilio.account_sid
// const authToken = config.twilio.auth_token

// const twilioClient = twilio(accountSid, authToken)

// const NUM_PINGPOD = '+16467936469'
// const NUM_TO_DEFAULT = '+19175887518'

// exports.requestAccessCode = functions.https.onCall(async (data = {}, context) => {
//   const message = twilioClient.messages.create({
//     body: data.message,
//     from: NUM_PINGPOD,
//     to: data.phone || NUM_TO_DEFAULT
//   })

//   return {
//     message
//   }
// })

const SquareConnect = require('square-connect')
const squareClient = SquareConnect.ApiClient.instance
squareClient.basePath = 'https://connect.squareupsandbox.com'

// Configure OAuth2 access token for authorization: oauth2
const oauth2 = squareClient.authentications['oauth2']
// oauth2.accessToken = functions.config().square.access_token_dev
oauth2.accessToken = "EAAAEH_SRRZA-IkqcVz6uvVLlDcISN2fTMZ23UT03VNi-6jb3fevLSSjuMgjxEdV"

const customersApi = new SquareConnect.CustomersApi()

exports.newCustomer = functions.https.onCall(async (data = {}, context) => {
  const { email_address, reference_id } = data 

  /* Creates a new customer for a business, which can have associated cards on file. 
  You must provide at least one of the following values in your request to this endpoint: 
  - `given_name` 
  - `family_name` 
  - `company_name` 
  - `email_address` 
  - `phone_number`
  */
  const body = {
    email_address,
    reference_id,
    idempotency_key: uuid()
  }

  try {
    const data = customersApi.createCustomer(body)
    return data
  } catch(err) {
    throw err
  }
})


exports.addCustomerCard = functions.https.onCall(async (data = {}, context) => {
  const { customerId, card_nonce } = data

  // https://github.com/square/connect-nodejs-sdk/blob/master/docs/CreateCustomerCardRequest.md
  const body = {
    card_nonce,
  }

  try {
    const data = await customersApi.createCustomerCard(customerId, body)
    console.log('Created a customer card!', data)
    return data
  } catch(err) {
    console.log(err)
  }
})


exports.getCustomer = functions.https.onCall(async (data = {}, context) => {
  const { customer_id } = data

  try {
    const data = await customersApi.retrieveCustomer(customer_id)
    return data
  } catch(err) {
    throw err
  }
})
