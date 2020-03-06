const reservations = require('../reservations')
const locations = require('../../locations')
const { getReservationRanges } = require('../../shared/getReservationRanges')
const getBillingThreshold = require('./getBillingThreshold')
const { INTERVAL_MS } = require('../../shared/constants')

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
  let _upcomingReservations = await reservations.search({
    rules: [
      ['reservationTime', '>=', (Date.now() - 1000 * 60 * 60)]
    ]
  })

  const upcomingReservations = _upcomingReservations.filter(r => !r.canceled)

  const reservationsByLocation = sortByKey(upcomingReservations, 'locationId')
  const modifiedReservations = []

  Object.keys(reservationsByLocation).forEach(locationId => {
    const location = locations[locationId]
    const localReservations = reservationsByLocation[locationId]
    const reservationsByTime = sortByKey(localReservations, 'reservationTime')

    const reservationsToTables = {}

    Object.keys(reservationsByTime).sort().forEach(time => {
      const reservationsByTable = {}

      const lastTime = time - INTERVAL_MS
      const lastReservations = reservationsByTime[lastTime] || []
      const currentReservations = reservationsByTime[time]

      currentReservations.forEach(res => {
        const newRes = { ...res }
        let suggestedTableId

        const _prevRes = lastReservations.find(r => r.userId === res.userId) || {}
        const recommended = reservationsToTables[_prevRes.id]
        if (res.tableId) {
          suggestedTableId = res.tableId
        } else if (recommended && !reservationsByTable[recommended]) {
          suggestedTableId = recommended
        } else {
          const empty = location.tables.find(t => !reservationsByTable[t.id])
          suggestedTableId = empty.id
        }

        newRes.suggestedTableId = suggestedTableId
        modifiedReservations.push(newRes)
        reservationsByTable[suggestedTableId] = newRes
        reservationsToTables[newRes.id] = suggestedTableId
      })
    })
  })

  return await reservations.updateMultiple({
    reservations: modifiedReservations
  })
}

module.exports = assignTables