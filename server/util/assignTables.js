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

    const assignmentsByTime = {}

    const assign = ({ reservation, time, tableId }) => {
      assignmentsByTime[time] = assignmentsByTime[time] || {}
      assignmentsByTime[time][tableId] = reservation
      modifiedReservations.push({
        ...reservation,
        suggestedTableId: tableId
      })
    }

    const preassigned = localReservations.filter(r => r.tableId)

    preassigned.forEach(res => {
      const { reservationTime: time, tableId } = res
      assign({ reservation: res, time, tableId })
    })

    const unassigned = localReservations.filter(r => !r.tableId)
    const reservationsByTime = sortByKey(unassigned, 'reservationTime')

    Object.keys(reservationsByTime).sort().forEach(time => {
      const lastTime = time - INTERVAL_MS
      const remainingReservations = reservationsByTime[time]

      location.tables.forEach(table => {
        // This table is already assigned at this time.
        if (assignmentsByTime[time] && assignmentsByTime[time][table.id]) return

        const lastAssignments = assignmentsByTime[lastTime] || {}
        const lastAssignmentAtTable = lastAssignments[table.id] || {}
        const match = remainingReservations.find(r => r.userId === lastAssignmentAtTable.userId)

        if (match) {
          const index = remainingReservations.indexOf(match)
          remainingReservations.splice(index, 1)
          assign({ reservation: match, tableId: table.id, time })
          return
        }
      })

      remainingReservations.forEach(res => {
        const empty = location.tables.find(t => !assignmentsByTime[time] || !assignmentsByTime[time][t.id])
        assign({ reservation: res, tableId: empty.id, time })
      })
    })
  })

  return await reservations.updateMultiple({
    reservations: modifiedReservations
  })
}

module.exports = assignTables