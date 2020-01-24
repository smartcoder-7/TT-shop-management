const { db } = require('./util/firebase')
const stripe = require('./util/stripe')

const cancelReservation = async ({ reservationId, refund }) => {
  try {
    const ref = db.collection('reservations').doc(reservationId)
    const doc = await ref.get()

    if (!doc.exists) throw 'No such reservation.'

    const reservation = doc.data()

    const update = { canceled: true }

    if (refund && reservation.chargeId) {
      const refund = await stripe.refunds.create({ charge: reservation.chargeId })
      update.refundId = refund.id
    }

    await ref.update(update)
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