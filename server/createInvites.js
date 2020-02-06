const uuid = require('uuid')
const { db } = require('./util/firebase')
const origin = require('../shared/getOrigin')

const createInvites = async (req, res) => {
  const {
    userId,
    reservations,
  } = req.body

  const tokenId = uuid()

  const createInvite = async (reservationId) => {
    const inviteId = uuid()
    const inviteData = {
      id: inviteId,
      tokenId,
      userId,
      reservationId,
      accepted: false,
      timestamp: Date.now()
    }

    const inviteRef = db.collection('invites').doc(inviteId)

    try {
      await inviteRef.set(inviteData)
    } catch (err) {
      res.status(500).send(err.message)
    }
  }

  try {
    // TODO: use batch
    await Promise.all(reservations.map(createInvite))
  } catch (err) {
    res.status(500).send(err.message)
  }

  res.status(200).json({
    inviteUrl: `${origin}/invite/${tokenId}`
  })
}

module.exports = createInvites
