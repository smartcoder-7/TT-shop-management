const { db } = require('./firebase')
const locations = require('../../locations.json')

const getTables = location => {
  const total = []
  const regular = []
  const premium = []

  location.tables.forEach(t => {
    if (t.isPremium) premium.push(t)
    else regular.push(t)
    total.push(t)
  })

  return { total, regular, premium }
}

class AvailabilityCheck {
  constructor({
    locationId,
    startTime,
    endTime
  }) {
    if (!endTime) endTime = startTime

    this.location = locations[locationId]
    this.tables = getTables(this.location)

    this.query = db.collection('reservations')
      .where('locationId', '==', locationId)
      .where('reservationTime', '>=', startTime)
      .where('reservationTime', '<=', endTime)
  }

  numTables(key = 'total') {
    return this.tables[key].length
  }

  async run() {
    this.reservationsByTime = {}

    // Get location, and check availability.
    this.queryResponse = await this.query.get()

    if (!this.queryResponse) return

    this.queryResponse.docs.forEach(doc => {
      const reservation = doc.data()
      const time = reservation.reservationTime
      this.reservationsByTime[time] = this.reservationsByTime[time] || []
      this.reservationsByTime[time].push(reservation)
    })
  }

  getReservationsAt(time, filter = () => true) {
    const reservations = this.reservationsByTime[time] || []
    return reservations.filter(filter).length
  }

  anyTablesLeftAt(time) {
    return this.numTables() - this.getReservationsAt(time)
  }

  regularTablesLeftAt(time) {
    return this.numTables('regular') - this.getReservationsAt(time, r => !r.isPremium)
  }

  premiumTablesLeftAt(time) {
    return this.numTables('premium') - this.getReservationsAt(time, r => !!r.isPremium)
  }
}

module.exports = AvailabilityCheck
