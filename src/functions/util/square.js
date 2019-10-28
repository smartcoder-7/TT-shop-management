const SquareConnect = require('square-connect')
const squareClient = SquareConnect.ApiClient.instance
squareClient.basePath = 'https://connect.squareupsandbox.com'

const oauth2 = squareClient.authentications['oauth2']
// oauth2.accessToken = process.env['SQUARE_ACCESS_TOKEN']
oauth2.accessToken = "EAAAEH_SRRZA-IkqcVz6uvVLlDcISN2fTMZ23UT03VNi-6jb3fevLSSjuMgjxEdV"

const paymentsApi = new SquareConnect.PaymentsApi()
const customersApi = new SquareConnect.CustomersApi()

module.exports = {
  paymentsApi, 
  customersApi
}