const { db } = require('./util/firebase')

const getOrder = async (req, res) => {
  const {
    orderId,
  } = req.body

  let order

  try {
    const orderDoc = await db.collection('orders').doc(orderId).get()
    order = orderDoc.data() || {}
  } catch (err) {
    return res.status(500).send('Failed to get order.')
  }

  const reservationIds = order.reservations || []

  const promises = reservationIds.map(id => {
    return new Promise((resolve, reject) => {
      db.collection('reservations').doc(id).get()
        .then(doc => resolve(doc.data()))
    })
  })

  const reservations = await Promise.all(promises)

  res.status(200).json({
    ...order,
    reservations
  })
}

module.exports = getOrder
