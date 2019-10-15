const functions = require('firebase-functions')
const twilio = require('twilio')
const admin = require('firebase-admin')
const uuid = require( 'uuid')
const db = require('./util/db')

const getSessionPrice = require('./shared/getSessionPrice')
const { paymentsApi } = require('./util/square')

const invalidate = ({ paymentId, userId, reservationId }) => {
  // payment should also be canceled here if it exists

  const userPromise = db.collection('users').doc(userId)
  .update({ error: 'Invalid billing information.' })

  const reservationPromise = db.collection('reservations').doc(reservationId)
  .update({ error: 'Could not charge user. Check billing information.' })

  return allSettled([
    userPromise,
    reservationPromise
  ])
}

const chargeReservation = ({
  userId,
  time
}) => {
  const userRef = db.collection('users').doc(userId)

  return new Promise((resolve, reject) => {
    userRef.get()
    .then(doc => {
      if (!doc.exists) {
        reject(Error('No user found.'))
        return
      }

      const userData = doc.data()

      const rate = getSessionPrice({ time })
      const price = rate.price.NON_MEMBER

      if (
        !userData.activeCard ||
        !userData.uid ||
        !userData.squareId
      ) {
        return reject(Error(`Cannot charge user: ${userId}`))
      }

      const body = {
        source_id: userData.activeCard,
        reference_id: userData.uid,
        amount_money: {
          "amount": price * 100,
          "currency": "USD"
        },
        customer_id: userData.squareId,
        idempotency_key: uuid()
      }

      paymentsApi.createPayment(body).then((data) => {
        resolve(data)
      }, function(error) {
        reject(error)
      })
    })
  })
}

const processReservation = (doc) => {
  const data = doc.data()

  return new Promise((resolve, reject) => {
    chargeReservation(data)
    .then(charge => {
      const payment = {
        id: charge.payment.id
      }

      // Update in DB!
      db.collection('reservations').doc(doc.id)
        .update({ payment })
        .then(() => {
          resolve(charge)
        })
        .catch(err => {
          invalidate({ 
            paymentId: payment.id, 
            reservationId: doc.id, 
            userId: data.userId
          }).then(() => {
            reject(err)
          })
        })
    })
    .catch(err => {
      invalidate({ 
        reservationId: doc.id, 
        userId: data.userId
      }).then(() => {
        reject(err)
      })
    })
  })
}

const allSettled = (promises) => {
  return new Promise((resolve) => {
    const done = []

    promises.forEach(promise => {
      console.log('init promise')
      if (!promise.finally) {
        console.log('weird keys: ', Object.keys(promise))
      }
      
      promise
      .then((response) => {
        done.push(response)
      })
      .catch((err => {
        done.push(err)
      }))
      .finally(() => {
        if (done.length === promises.length) {
          return resolve(done)
        }
      })
    })
  })
}

const chargeCustomers = async () => {
  console.log('Initializing bulk customer charge.')

  const now = new Date().getTime()
  const exactly24HoursFromNow = now + (1000 * 60 * 60 * 24)

  const charge = () => (
    new Promise((resolve, reject) => {
      db.collection('reservations')
      .where('time', '<=', exactly24HoursFromNow)
      .orderBy('time')
      .get()
      .then(snapshot => {
        if (snapshot.empty) {
          return resolve([])
        }  

        const promises = []
      
        // Go through each reservation.
        snapshot.forEach(doc => {
          const data = doc.data()

          if (data.payment) {
            return
          }

          const promise = processReservation(doc)
          promises.push(promise)
        })

        allSettled(promises)
        .then(resolve)
        .catch(reject)
      })
    })
  )

  let charges

  try {
    charges = await charge()
  } catch(err) {
    console.log(err)
  }

  console.log('COMPLETE:', charges)
  return charges
}

module.exports = chargeCustomers