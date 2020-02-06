const { db } = require('./util/firebase')

const acceptInvites = async (req, res) => {
  const {
    userId,
    invites
  } = req.body

  const acceptInvite = async (inviteId) => {
    try {
      const doc = await db.collection('invites').doc(inviteId).get()
      const invite = doc.data() || {}

      if (invite.accepted) {
        throw { message: 'Invite has already been accepted.' }
      }

      const match = await db.collection('invites')
        .where('reservationId', '==', invite.reservationId)
        .where('invitedUser', '==', userId)
        .get()

      if (match.docs) {
        throw { message: 'This user has already been invited to this reservation.' }
      }

      await db.collection('invites').doc(inviteId).update({
        invitedUser: userId,
        accepted: true
      })
    } catch (err) {
      throw err
    }
  }

  try {
    await Promise.all(invites.map(acceptInvite))
    res.status(200).json({ success: true })
  } catch (err) {
    res.status(500).send(err.message)
  }
}

module.exports = acceptInvites
