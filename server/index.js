const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 7999

const ROOT_DIR = path.resolve(__dirname, '../')

const createReservation = require('./createReservation')
const getReservations = require('./getReservations')
const createUser = require('./createUser')

express()
  .use(express.static(path.resolve(ROOT_DIR, 'public')))
  .use(express.json())

  .get('/', (req, res) => res.sendFile('/index.html'))

  .post('/api/create-reservation', createReservation)
  .post('/api/get-reservations', getReservations)
  .post('/api/create-user', createUser)

  .listen(PORT, () => console.log(`Listening on ${ PORT }`))