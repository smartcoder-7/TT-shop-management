const uuid = require('uuid')
const { db } = require('./util/firebase')
const chargeUser = require('./util/chargeUser')

const createPurchase = async ({ userId, locationId, amount, description }) => {
  const purchaseId = uuid()
  const purchaseData = {
    id: purchaseId,
    userId,
    amount,
    locationId,
    description,
    timestamp: Date.now(),
  }

  const purchaseRef = db.collection('purchases').doc(purchaseId)

  if (!amount) {
    return true
  }

  try {
    const charge = await chargeUser({
      userId,
      amount,
      description
    })

    purchaseData.chargeId = charge.id
    await purchaseRef.set(purchaseData)
  } catch (err) {
    purchaseData.chargeError = err.message || err
    await purchaseRef.set(purchaseData)
    throw err
  }

  return true
}

const createPurchases = async (req, res) => {
  const {
    purchases = []
  } = req.body

  // TODO: Batch
  try {
    await Promise.all(purchases.map(p => {
      return createPurchase(p)
    }))
  } catch (err) {
    res.status(500).send(err.message)
  }

  res.status(200).json({
    success: true,
  })
}

module.exports = createPurchases
