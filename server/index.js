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
const createPurchase = require('./createPurchase')
const getOrder = require('./getOrder')
const getAvailableSessions = require('./getAvailableSessions')
const createUser = require('./createUser')
const createInvites = require('./createInvites')
const getInvites = require('./getInvites')
const acceptInvites = require('./acceptInvites')
const getUser = require('./getUser')
const getUsers = require('./getUsers')
const updateUserBilling = require('./updateUserBilling')
const getUserBilling = require('./getUserBilling')
const updateUserInfo = require('./updateUserInfo')
const sendEmail = require('./sendEmail')
const getUnlocks = require('./getUnlocks')
const autochargeReservations = require('./util/autochargeReservations')
const { unlockDoor } = require('./kisi')

express()
  .use(express.static(path.resolve(ROOT_DIR, 'public')))
  .use(express.json())

  .post('/api/cancel-reservations', authenticate(cancelReservations))
  .post('/api/charge-reservations', chargeReservations)
  .post('/api/create-reservations', authenticate(createReservations))
  .post('/api/validate-reservations', authenticate(validateReservations))
  .post('/api/get-reservations', getReservations)
  .post('/api/create-purchase', authenticate(createPurchase))
  .post('/api/get-order', authenticate(getOrder))
  .post('/api/create-user', createUser)
  .post('/api/get-user', authenticate(getUser))
  .post('/api/get-users', authenticate(getUsers))
  .post('/api/get-unlocks', getUnlocks)
  .post('/api/update-user-billing', authenticate(updateUserBilling))
  .post('/api/get-user-billing', getUserBilling)
  .post('/api/get-available-sessions', getAvailableSessions)
  .post('/api/update-user-info', updateUserInfo)
  .post('/api/send-email', authenticate(sendEmail))
  .post('/api/create-invites', authenticate(createInvites))
  .post('/api/get-invites', authenticate(getInvites))
  .post('/api/accept-invites', authenticate(acceptInvites))

  .post('/api/unlock-door', authenticate(unlockDoor))

  // .post('/private/autocharge-reservations', autochargeReservations)

  .get('/robots.txt', (req, res) => res.sendFile(path.resolve(ROOT_DIR, 'robots.txt')))
  .get('*', (req, res) => res.sendFile(path.resolve(ROOT_DIR, 'public/index.html')))

  .listen(PORT, () => console.log(`Listening on ${PORT}`))
