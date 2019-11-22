require('dotenv').config()
const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 7999

const ROOT_DIR = path.resolve(__dirname, '../')

const createReservations = require('./createReservations')
const getReservations = require('./getReservations')
const createUser = require('./createUser')
const updateUserBilling = require('./updateUserBilling')
const getUserBilling = require('./getUserBilling')

express()
  .use(express.static(path.resolve(ROOT_DIR, 'public')))
  .use(express.json())

  .get('/', (req, res) => res.sendFile('/index.html'))

  .post('/api/create-reservations', createReservations)
  .post('/api/get-reservations', getReservations)
  .post('/api/create-user', createUser)
  .post('/api/update-user-billing', updateUserBilling)
  .post('/api/get-user-billing', getUserBilling)

  .listen(PORT, () => console.log(`Listening on ${ PORT }`))