const stripe = require('./stripe')
const { db } = require('./firebase')
const RateLimiter = require('limiter').RateLimiter
const getReservationCost = require('../../shared/getReservationCost')

// Stripe Rate Limit (25/s in testing, 100/s in production)
const limiter = new RateLimiter(25, 'second');

const chargeReservation = async ({
  reservationId,
}) => {
  let reservation, userRef, user

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

  try {
    userRef = db.collection('users').doc(reservation.userId)
    const userDoc = await userRef.get()
    user = userDoc.data()
  } catch (err) {
    throw 'User does not exist.'
  }

  if (!user.stripeId) {
    throw 'User does not have an associated Stripe id.'
  }

  if (!user.hasActiveCard) {
    throw 'User does not have an active card.'
  }

  const stripeCustomer = await stripe.customers.retrieve(user.stripeId)

  if (!stripeCustomer) {
    throw 'Cannot find the user\'s associated Stripe account.'
  }

  if (!stripeCustomer.default_source) {
    throw 'User does not have a default payment source in Stripe.'
  }

  const rate = getReservationCost(reservation)
  if (!rate) throw 'Cannot find associated pricing.'

  // toggle MEMBER
  const amountDollars = user.isMember ? rate.MEMBER : rate.NON_MEMBER
  if (Number.isNaN(amountDollars) || amountDollars > 100) throw 'Calculated cost is invalid.'

  const perSession = amountDollars / 2
  const amount = perSession * 100

  try {
    const charge = await stripe.charges.create({
      amount,
      currency: 'usd',
      customer: stripeCustomer.id,
      source: stripeCustomer.default_source,
      description: 'PINGPOD: Table Reservation',
    });
    return charge
  } catch (err) {
    console.log('[Stripe Error]', err)
    throw err.message || err.type
  }
}

const chargeReservations = async ({ reservations }) => {
  const promises = reservations.map(({ id, userId }) => (
    new Promise((resolve) => {
      const reservationId = id
      const reservationRef = db.collection('reservations').doc(reservationId)
      const userRef = db.collection('users').doc(userId)
      const lastCharged = Date.now()

      limiter.removeTokens(1, () => {
        chargeReservation({ reservationId })
          .then(charge => {
            const data = { chargeId: charge.id, chargeError: null, lastCharged }
            console.log('[Successful Charge]', reservationId, data)
            reservationRef.update(data)
            resolve(true)
          })
          .catch((chargeError = 'Unknown Error') => {
            const data = { chargeError, lastCharged }
            console.log('[Charge Error]', reservationId, data)
            reservationRef.update(data)
            userRef.update({ hasActiveCard: false })

            resolve(false)
          })
      })
    })
  ))

  const responses = await Promise.all(promises)
  const reservationsCharged = reservations.filter((_, i) => !!responses[i])
  const reservationsErrored = reservations.filter((_, i) => !responses[i])

  return {
    reservationsCharged,
    reservationsErrored
  }
}


module.exports = chargeReservations
