const { db } = require('./util/firebase')
const stripe = require('./util/stripe')
const reservations = require('./reservations')
const invites = require('./invites')

const cancelReservation = async ({ reservationId, refund }) => {
  try {
    const reservation = await reservations.get(reservationId)
    const matchingInvites = await invites.search({ rules: [['reservationId', '==', reservationId]] })

    const update = { canceled: true, canceledAt: Date.now() }

    const rate = reservation.customRate !== undefined
      ? reservation.customRate
      : (reservation.rate !== undefined ? reservation.rate : 10)
    const amount = rate / 2

    if (
      refund &&
      reservation.chargeId &&
      reservation.chargeId !== 'FREE_OF_CHARGE' &&
      amount > 0
    ) {
      const refund = await stripe.refunds.create({ charge: reservation.chargeId, amount })
      update.refundId = refund.id
    }

    await invites.updateMultiple({
      invites: matchingInvites.map(i => ({
        ...i,
        ...update
      }))
    })

    await reservations.update({
      ...reservation,
      ...update
    })
    return reservationId
  } catch (err) {
    throw err
  }
}

const cancelReservations = async (req, res) => {
  const {
    reservations,
    refund
  } = req.body

  const promises = reservations.map(reservationId => {
    return cancelReservation({ reservationId, refund })
  })

  try {
    await Promise.all(promises)
    res.status(200).send({ success: true })
  } catch (err) {
    res.status(400).send(err.message)
  }
}

module.exports = cancelReservations