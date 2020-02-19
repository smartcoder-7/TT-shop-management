const { db } = require('./util/firebase')

const IS_OFFLINE = !!process.env.IS_OFFLINE

const getPurchases = async (req, res) => {
  const {
    userId,
    locationId,
    // timestamp
  } = req.body

  // Get location, and check availability.
  let query = db.collection('purchases')

  if (userId !== undefined) {
    query = query.where('userId', '==', userId)
  }

  if (locationId !== undefined) {
    query = query.where('locationId', '==', locationId)
  }

  // if (timestamp !== undefined) {
  //   query = query.where('reservationId', '==', timestamp)
  // }

  if (IS_OFFLINE) {
    query = db.collection('purchases')
  }

  try {
    const result = await query.get()
    const _purchases = []

    if (result.docs) {
      result.docs.forEach(doc => {
        _purchases.push(doc.data())
      })
    }

    // const invites = []
    // await Promise.all(_invites.map(i => {
    //   if (!i.reservationId) return Promise.resolve()
    //   return getReservation({ reservationId: i.reservationId })
    //     .then((reservation) => {
    //       invites.push({ ...i, reservation })
    //     })
    // }))

    res.status(200).json({
      purchases: _purchases
    })
  } catch (err) {
    res.status(500).send(err.message)
    return
  }
}

module.exports = getPurchases
