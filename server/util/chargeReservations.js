const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const { db } = require('./firebase')
const getReservationCost = require('../../shared/getReservationCost')

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
  const amountDollars = rate.MEMBER
  if (Number.isNaN(amountDollars) || amountDollars > 100) throw 'Calculated cost is invalid.'

  const amount = amountDollars * 100
  const charge = await stripe.charges.create({
    amount,
    currency: 'usd',
    customer: stripeCustomer.id,
    source: stripeCustomer.default_source,
    description: 'PINGPOD: Table Reservation',
  });

  return charge
}

const chargeReservations = async ({ reservations }) => {
  const promises = reservations.map(reservationId => (
    new Promise((resolve) => {
      const reservationRef = db.collection('reservations').doc(reservationId)
      const lastCharged = Date.now()

      chargeReservation({ reservationId })
        .then(charge => {
          reservationRef.update({ chargeId: charge.id, chargeError: null, lastCharged })
          resolve(true)
        })
        .catch(err => {
          const chargeError = err.message
          reservationRef.update({ chargeError, lastCharged })
          resolve(false)
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
