const uuid = require('uuid')
const { db } = require('./util/firebase')
const chargeUser = require('./util/chargeUser')

const createPurchase = async (req, res) => {
  const {
    userId,
    locationId,
    purchase = {}
  } = req.body

  const items = purchase.items || []
  const customAmount = purchase.customAmount || 0
  const customDescription = purchase.customDescription || ''

  const purchaseId = uuid()
  const purchaseData = {
    id: purchaseId,
    userId,
    customAmount,
    locationId,
    customDescription,
    items
  }

  const purchaseRef = db.collection('purchases').doc(purchaseId)

  try {
    const charge = await chargeUser({
      userId,
      amount: customAmount,
      description: customDescription
    })

    purchaseData.chargeId = charge.id
    await purchaseRef.set(purchaseData)
  } catch (err) {
    purchaseData.chargeError = err.message
    await purchaseRef.set(purchaseData)
    res.status(500).send(err.message)
  }

  res.status(200).json({
    success: true,
    purchase: purchaseData
  })
}

module.exports = createPurchase
