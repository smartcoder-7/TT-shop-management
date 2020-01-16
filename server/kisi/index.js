const { db } = require('../util/firebase')
const Kisi = require("kisi-client").default
const locations = require('../../locations')
const canUnlock = require('../../shared/canUnlock')

const kisiClient = new Kisi()

const authenticate = async () => {
  await kisiClient.signIn("christine@pingpod.com", "UrLr_QvNzU2Wa-PB4hgw")
}

const unlockDoor = async (req, res) => {
  const {
    userId,
    reservationId,
  } = req.body

  let reservation

  await authenticate()

  try {
    const doc = await db.collection('reservations').doc(reservationId).get()
    if (!doc.exists) return res.status(500).send('Reservation does not exist.')
    reservation = doc.data()
  } catch (err) {
    return res.status(500).send('Cannot reach server.')
  }

  if (reservation.userId !== userId) {
    return res.status(503).send('Access denied.')
  }

  if (!canUnlock(reservation)) {
    return res.status(503).send('Outside of reservation access window.')
  }

  const { locationId } = reservation
  const location = locations[locationId]

  return res.status(200).json({ success: true })

  // TODO - replace with Kisi in prod.

  kisiClient
    .post(`/locks/${location.lockId}/unlock`, {})
    .then(result => {
      return res.status(200).json(result)
    })
    .catch(error => {
      const { message, reason, code } = error
      const err = `${code ? `[${code}]` : ''} ${message || ''} ${reason || ''}`

      return res.status(error.status).send(err)
    })
}

module.exports = {
  unlockDoor
}