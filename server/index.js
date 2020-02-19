require('dotenv').config()
const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 7999

const ROOT_DIR = path.resolve(__dirname, '../')

const authenticate = require('./util/authenticate')

const validateReservations = require('./validateReservations')
const chargeReservations = require('./chargeReservations')
const createReservations = require('./createReservations')
const cancelReservations = require('./cancelReservations')
const getReservations = require('./getReservations')
const createPurchases = require('./createPurchases')
const getOrder = require('./getOrder')
const getAvailableSessions = require('./getAvailableSessions')
const createInvites = require('./createInvites')
const getInvites = require('./getInvites')
const getPurchases = require('./getPurchases')
const acceptInvites = require('./acceptInvites')
const getUserBilling = require('./getUserBilling')
const sendEmail = require('./sendEmail')
const getUnlocks = require('./getUnlocks')
const getItemsByLocation = require('./getItemsByLocation')
const { unlockDoor } = require('./kisi')
const users = require('./users')

const app = express()

app
  .use(express.static(path.resolve(ROOT_DIR, 'public')))
  .use(express.json())

  .post('/api/cancel-reservations', authenticate(cancelReservations))
  .post('/api/charge-reservations', chargeReservations)
  .post('/api/create-reservations', authenticate(createReservations))
  .post('/api/validate-reservations', authenticate(validateReservations))
  .post('/api/get-reservations', getReservations)
  .post('/api/create-purchases', authenticate(createPurchases))
  .post('/api/get-order', authenticate(getOrder))
  .post('/api/get-purchases', authenticate(getPurchases))
  .post('/api/get-unlocks', getUnlocks)
  .post('/api/get-user-billing', getUserBilling)
  .post('/api/get-available-sessions', getAvailableSessions)
  .post('/api/send-email', authenticate(sendEmail))
  .post('/api/create-invites', authenticate(createInvites))
  .post('/api/get-invites', authenticate(getInvites))
  .post('/api/accept-invites', authenticate(acceptInvites))

  .post('/api/unlock-door', authenticate(unlockDoor))
  .post('/api/get-products', getItemsByLocation)

  // .post('/private/autocharge-reservations', autochargeReservations)

  .get('/robots.txt', (req, res) => res.sendFile(path.resolve(ROOT_DIR, 'robots.txt')))
  .get('*', (req, res) => res.sendFile(path.resolve(ROOT_DIR, 'public/index.html')))


users.applyRoutes(app)

app.listen(PORT, () => console.log(`Listening on ${PORT}`))
