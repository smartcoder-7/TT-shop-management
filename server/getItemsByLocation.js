const listItems = require('./zoho/listItems')
const locations = require('../locations')

const getItemsByLocation = async (req, res) => {
  const {
    locationId,
  } = req.body

  const location = locations[locationId]

  if (!location) {
    return res.status(500).send('Location does not exist.')
  }

  if (!location.items || !location.items.length) {
    return res.status(200).json({
      items: []
    })
  }

  try {
    const allItems = await listItems()
    const items = allItems.filter(i => location.items.indexOf(i.sku) > -1)
    res.status(200).json({
      items
    })
  } catch (err) {
    return res.status(500).send(err.message)
  }
}

module.exports = getItemsByLocation
