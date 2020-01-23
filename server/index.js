require('dotenv').config()
const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 7999

const ROOT_DIR = path.resolve(__dirname, '../')

const authenticate = require('./util/authenticate')

const validateReservations = require('./validateReservations')
const chargeReservations = require('./chargeReservations')
const createReservations = require('./createReservations')
const getReservations = require('./getReservations')
const getOrder = require('./getOrder')
const getAvailableSessions = require('./getAvailableSessions')
const createUser = require('./createUser')
const getUser = require('./getUser')
const getUsers = require('./getUsers')
const updateUserBilling = require('./updateUserBilling')
const getUserBilling = require('./getUserBilling')
const updateUserInfo = require('./updateUserInfo')
const sendEmail = require('./sendEmail')
const { unlockDoor } = require('./kisi')

express()
  .use(express.static(path.resolve(ROOT_DIR, 'public')))
  .use(express.json())

  .post('/api/charge-reservations', chargeReservations)
  .post('/api/create-reservations', authenticate(createReservations))
  .post('/api/validate-reservations', authenticate(validateReservations))
  .post('/api/get-reservations', getReservations)
  .post('/api/get-order', authenticate(getOrder))
  .post('/api/create-user', authenticate(createUser))
  .post('/api/get-user', authenticate(getUser))
  .post('/api/get-users', authenticate(getUsers))
  .post('/api/update-user-billing', authenticate(updateUserBilling))
  .post('/api/get-user-billing', getUserBilling)
  .post('/api/get-available-sessions', getAvailableSessions)
  .post('/api/update-user-info', updateUserInfo)
  .post('/api/send-email', authenticate(sendEmail))

  .post('/api/unlock-door', authenticate(unlockDoor))

  .get('/robots.txt', (req, res) => res.sendFile(path.resolve(ROOT_DIR, 'robots.txt')))
  .get('*', (req, res) => res.sendFile(path.resolve(ROOT_DIR, 'public/index.html')))

  .listen(PORT, () => console.log(`Listening on ${PORT}`))
