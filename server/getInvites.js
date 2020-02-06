const { db } = require('./util/firebase')
const getReservation = require('./util/getReservation')

const IS_OFFLINE = !!process.env.IS_OFFLINE

const getInvites = async (req, res) => {
  const {
    userId,
    tokenId,
    invitedUser,
    reservationId,
  } = req.body

  // Get location, and check availability.
  let query = db.collection('invites')

  if (userId !== undefined) {
    query = query.where('userId', '==', userId)
  }

  if (tokenId !== undefined) {
    query = query.where('tokenId', '==', tokenId)
  }

  if (reservationId !== undefined) {
    query = query.where('reservationId', '==', reservationId)
  }

  if (invitedUser !== undefined) {
    query = query.where('invitedUser', '==', invitedUser)
  }

  if (IS_OFFLINE) {
    query = db.collection('invites')
  }

  try {
    const result = await query.get()
    const _invites = []

    if (result.docs) {
      result.docs.forEach(doc => {
        _invites.push(doc.data())
      })
    }

    const invites = []
    await Promise.all(_invites.map(i => {
      if (!i.reservationId) return Promise.resolve()
      return getReservation({ reservationId: i.reservationId })
        .then((reservation) => {
          invites.push({ ...i, reservation })
        })
    }))

    res.status(200).json({
      invites
    })
  } catch (err) {
    res.status(500).send(err.message)
    return
  }
}

module.exports = getInvites
