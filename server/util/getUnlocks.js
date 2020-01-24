const { db } = require('./firebase')

const getUnlocks = async ({ reservationId, userId }) => {
  const query = db.collection('unlocks')
    .where('userId', '==', userId)
    .where('reservationId', '==', reservationId)

  try {
    const result = await query.get()
    const unlocks = []

    if (result.docs) {
      result.docs.forEach(doc => {
        unlocks.push(doc.data())
      })
    }

    return unlocks
  } catch (err) {
    throw err
  }
}

module.exports = getUnlocks