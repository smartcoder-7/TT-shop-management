const { db } = require('./firebase')

const applyInvites = async (reservation) => {
  try {
    const { docs } = await db.collection('invites')
      .where('reservationId', '==', reservation.id)
      .get()

    if (docs && docs.length) {
      reservation.invites = []
      docs.forEach(doc => { reservation.invites.push(doc.data()) })
    }

    return reservation
  } catch (err) {
    throw err
  }
}

module.exports = applyInvites