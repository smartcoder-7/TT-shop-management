const reservations = require('../reservations')
const locations = require('../../locations')
const getBillingThreshold = require('./getBillingThreshold')

const assignTables = async () => {
  let upcomingReservations = await reservations.search({
    rules: [
      ['reservationTime', '>=', (Date.now() - 1000 * 60 * 60)]
    ]
  })

  const reservationsByLocation = {}

  upcomingReservations.forEach((res) => {
    const { locationId } = res
    reservationsByLocation[locationId] = reservationsByLocation[locationId] || []
    reservationsByLocation[locationId].push(res)
  })

  Object.keys(reservationsByLocation).forEach(locationId => {
    const location = locations[locationId]
    const tables = location.tables.slice()

    const sortedReservations = reservationsByLocation[locationId]
      .sort((a, b) => a.reservationTime < b.reservationTime ? 1 : -1)

    console.log(tables, sortedReservations)
  })
}

module.exports = assignTables