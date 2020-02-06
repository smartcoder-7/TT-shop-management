const { db } = require('./util/firebase')

const acccpetInvites = async (req, res) => {
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

module.exports = acccpetInvites
