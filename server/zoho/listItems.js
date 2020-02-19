const zoho = require('../util/zoho')

const listItems = async () => {
  try {
    const { items } = await zoho.get('https://invoice.zoho.com/api/v3/items')
    return items
  } catch (err) {
    throw err
  }
}

module.exports = listItems