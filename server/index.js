require('dotenv').config()
const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 7999

const ROOT_DIR = path.resolve(__dirname, '../')

const createReservations = require('./createReservations')
const getReservations = require('./getReservations')
const getAvailableSessions = require('./getAvailableSessions')
const createUser = require('./createUser')
const updateUserBilling = require('./updateUserBilling')
const getUserBilling = require('./getUserBilling')

express()
  .use(express.static(path.resolve(ROOT_DIR, 'public')))
  .use(express.json())

  .post('/api/create-reservations', createReservations)
  .post('/api/get-reservations', getReservations)
  .post('/api/create-user', createUser)
  .post('/api/update-user-billing', updateUserBilling)
  .post('/api/get-user-billing', getUserBilling)
  .post('/api/get-available-sessions', getAvailableSessions)

  .get('*', (req, res) => res.sendFile(path.resolve(ROOT_DIR, 'public/index.html')))

  .listen(PORT, () => console.log(`Listening on ${PORT}`))