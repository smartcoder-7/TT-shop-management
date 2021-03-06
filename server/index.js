require('dotenv').config()
const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 7999

const ROOT_DIR = path.resolve(__dirname, '../')

const authenticate = require('./util/authenticate')

const validateReservations = require('./validateReservations')
const createReservations = require('./createReservations')
const cancelReservations = require('./cancelReservations')
const getReservations = require('./getReservations')
const createPurchases = require('./createPurchases')
const getOrder = require('./getOrder')
const getAvailableSessions = require('./getAvailableSessions')
const getPurchases = require('./getPurchases')
const acceptInvites = require('./acceptInvites')
const getUserBilling = require('./getUserBilling')
const sendEmail = require('./sendEmail')
const getItemsByLocation = require('./getItemsByLocation')
const autochargeReservations = require('./util/autochargeReservations')
const assignTables = require('./util/assignTables')
const users = require('./users')
const invites = require('./invites')
const unlocks = require('./unlocks')
const products = require('./products')
const reservations = require('./reservations')

const app = express()

app
  .use(express.static(path.resolve(ROOT_DIR, 'public')))
  .use(express.static(path.resolve(ROOT_DIR, 'public/dist')))
  .use(express.json())

  .post('/api/cancel-reservations', authenticate(cancelReservations))
  .post('/api/create-reservations', authenticate(createReservations))
  .post('/api/validate-reservations', authenticate(validateReservations))
  .post('/api/get-reservations', getReservations)
  .post('/api/create-purchases', authenticate(createPurchases))
  .post('/api/get-order', authenticate(getOrder))
  .post('/api/get-purchases', authenticate(getPurchases))
  .post('/api/get-user-billing', getUserBilling)
  .post('/api/get-available-sessions', getAvailableSessions)
  .post('/api/send-email', authenticate(sendEmail))
  .post('/api/accept-invites', authenticate(acceptInvites))

  .post('/api/get-products', getItemsByLocation)

  .get('/robots.txt', (req, res) => res.sendFile(path.resolve(ROOT_DIR, 'robots.txt')))

  .get('/', (req, res) => res.sendFile(path.resolve(ROOT_DIR, 'public/dist/index.html')))
  .get('*', (req, res) => res.sendFile(path.resolve(ROOT_DIR, 'public/dist/app.html')))

users.applyRoutes(app)
invites.applyRoutes(app)
unlocks.applyRoutes(app)
products.applyRoutes(app)
reservations.applyRoutes(app)

if (process.env.NODE_ENV === 'development') {
  app.post('/private/autocharge-reservations', autochargeReservations)
  app.post('/private/assign-tables', assignTables)
}

app.listen(PORT, () => console.log(`Listening on ${PORT}`))
