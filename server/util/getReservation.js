const { db } = require('./firebase')

const getReservation = async ({ reservationId }) => {
  const reservationRef = db.collection('reservations').doc(reservationId)
  const reservationDoc = await reservationRef.get()

  if (!reservationDoc.exists) throw 'Reservation does not exist.'
  return reservationDoc.data()
}

module.exports = getReservation