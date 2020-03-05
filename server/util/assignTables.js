const reservations = require('../reservations')
const locations = require('../../locations')
const { getReservationRanges } = require('../../shared/getReservationRanges')
const getBillingThreshold = require('./getBillingThreshold')

const sortByKey = (array, key) => {
  const sorted = {}

  array.forEach((item) => {
    const val = item[key]
    sorted[val] = sorted[val] || []
    sorted[val].push(item)
  })

  return sorted
}

const assignTables = async () => {
  let upcomingReservations = await reservations.search({
    rules: [
      ['reservationTime', '>=', (Date.now() - 1000 * 60 * 60)]
    ]
  })

  const reservationsByLocation = sortByKey(upcomingReservations, 'locationId')

  Object.keys(reservationsByLocation).forEach(locationId => {
    const location = locations[locationId]
    const localReservations = reservationsByLocation[locationId]
    const reservationsByUserId = sortByKey(localReservations, 'userId')
    const reservationsByTable = sortByKey(location.tables, 'id')

    const sortedReservations = reservationsByLocation[locationId]
      .sort((a, b) => a.reservationTime < b.reservationTime ? 1 : -1)

    let allRanges = []
    Object.values(reservationsByUserId).forEach(res => {
      const ranges = getReservationRanges(res)
      allRanges = allRanges.concat(ranges)
    })

    allRanges = allRanges.sort((a, b) => a[0].reservationTime > b[0].reservationTime ? 1 : -1)

    console.log(allRanges)



    // sortedReservations.forEach(reservation => {
    //   const { tableId } = reservation

    //   if (tableId && reservationsByTable[tableId]) {
    //     reservationsByTable[tableId]
    //   }
    // })
  })
}

module.exports = assignTables