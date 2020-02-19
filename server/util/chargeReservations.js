const stripe = require('./stripe')
const { db } = require('./firebase')
const chargeUser = require('./chargeUser')
const users = require('../users')
const RateLimiter = require('limiter').RateLimiter
const getReservationCost = require('../../shared/getReservationCost')

// Stripe Rate Limit (25/s in testing, 100/s in production)
const limiter = new RateLimiter(25, 'second');

const chargeReservation = async ({
  reservationId,
}) => {
  let reservation

  try {
    const reservationRef = db.collection('reservations').doc(reservationId)
    const reservationDoc = await reservationRef.get()
    reservation = reservationDoc.data()
  } catch (err) {
    throw 'Reservation does not exist.'
  }

  if (reservation.chargeId) {
    try {
      const charge = await stripe.charges.retrieve(reservation.chargeId)
      return charge
    } catch (err) {
      throw 'Reservation already has an associated charge ID, but it was unretrievable from Stripe.'
    }
  }

  if (
    !reservation.userId ||
    !reservation.locationId ||
    !reservation.reservationTime
  ) {
    throw 'Reservation has malformed data.'
  }


  const rate = getReservationCost(reservation)
  if (!rate) throw 'Cannot find associated pricing.'

  try {
    const user = await users.get(reservation.userId)

    let amountDollars = reservation.customRate

    // toggle MEMBER
    if (typeof reservation.customRate === 'undefined') {
      amountDollars = user.isMember ? rate.MEMBER : rate.NON_MEMBER
    }

    if (Number.isNaN(amountDollars) || amountDollars > 100) throw 'Calculated cost is invalid.'

    const perSession = amountDollars / 2
    const amount = perSession * 100

    if (amount <= 0) {
      return { id: 'ADMIN_BOOKING' }
    }

    return await chargeUser({
      userId: reservation.userId,
      amount,
      description: 'PINGPOD: Table Reservation'
    })
  } catch (err) {
    throw err.message
  }

}

const chargeReservations = async ({ reservations }) => {
  const promises = reservations.map(({ id }) => (
    new Promise((resolve) => {
      const reservationId = id
      const reservationRef = db.collection('reservations').doc(reservationId)
      const lastCharged = Date.now()

      limiter.removeTokens(1, () => {
        chargeReservation({ reservationId })
          .then(charge => {
            console.log(charge)
            const data = { chargeId: charge.id, chargeError: null, lastCharged }
            console.log('[Successful Charge]', reservationId, data)
            reservationRef.update(data)
            resolve(true)
          })
          .catch((chargeError = 'Unknown Error') => {
            const data = { chargeError: chargeError.message, lastCharged }
            console.log('[Charge Error]', reservationId, data)
            reservationRef.update(data)

            resolve(false)
          })
      })
    })
  ))

  try {
    const responses = await Promise.all(promises)
    const reservationsCharged = reservations.filter((_, i) => !!responses[i])
    const reservationsErrored = reservations.filter((_, i) => !responses[i])

    return {
      reservationsCharged,
      reservationsErrored
    }
  } catch (err) {
    throw err.message
  }
}


module.exports = chargeReservations
