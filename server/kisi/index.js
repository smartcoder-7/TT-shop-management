const uuid = require('uuid')
const { db } = require('../util/firebase')
const Kisi = require("kisi-client").default
const locations = require('../../locations')
const { canUnlock } = require('../../shared/canUnlock')
const getUnlocks = require('../util/getUnlocks')

const kisiClient = new Kisi()

const authenticate = async () => {
  await kisiClient.signIn(process.env.KISI_USERNAME, process.env.KISI_PASSWORD)
}

const unlockDoor = async (req, res) => {
  const {
    userId,
    reservationId,
  } = req.body

  let reservation, unlocks

  await authenticate()

  const reservationRef = db.collection('reservations').doc(reservationId)

  try {
    const doc = await reservationRef.get()
    if (!doc.exists) return res.status(500).send('Reservation does not exist.')
    reservation = doc.data()
  } catch (err) {
    return res.status(500).send(err.message)
  }

  if (reservation.userId !== userId) {
    return res.status(503).send('Access denied.')
  }

  if (!canUnlock(reservation)) {
    return res.status(503).send('Outside of reservation access window.')
  }

  try {
    unlocks = await getUnlocks({ reservationId, userId })
    if (unlocks.length >= 5) return res.status(503).send('Too many unlock attempts.')
  } catch (err) {
    return res.status(500).send(err.message)
  }

  const { locationId } = reservation
  const location = locations[locationId]

  const unlockId = uuid()
  const unlockRef = db.collection('unlocks').doc(unlockId)

  try {
    await unlockRef.set({ timestamp: Date.now(), userId, reservationId, locationId })
  } catch (err) {
    return res.status(500).send(err.message)
  }

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