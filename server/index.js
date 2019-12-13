require('dotenv').config()
const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 7999

const ROOT_DIR = path.resolve(__dirname, '../')

const authenticate = require('./util/authenticate')

const createReservations = require('./createReservations')
const getReservations = require('./getReservations')
const getAvailableSessions = require('./getAvailableSessions')
const createUser = require('./createUser')
const updateUserBilling = require('./updateUserBilling')
const getUserBilling = require('./getUserBilling')
const updateUserInfo = require('./updateUserInfo')

express()
  .use(express.static(path.resolve(ROOT_DIR, 'public')))
  .use(express.json())

  .post('/api/create-reservations', authenticate(createReservations))
  .post('/api/get-reservations', getReservations)
  .post('/api/create-user', authenticate(createUser))
  .post('/api/update-user-billing', authenticate(updateUserBilling))
  .post('/api/get-user-billing', getUserBilling)
  .post('/api/get-available-sessions', getAvailableSessions)
  .post('/api/update-user-info', updateUserInfo)

  .get('/robots.txt', (req, res) => res.sendFile(path.resolve(ROOT_DIR, 'robots.txt')))
  .get('*', (req, res) => res.sendFile(path.resolve(ROOT_DIR, 'public/index.html')))

  .listen(PORT, () => console.log(`Listening on ${PORT}`))