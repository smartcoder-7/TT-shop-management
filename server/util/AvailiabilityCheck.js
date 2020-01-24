const { db } = require('./firebase')
const locations = require('../../locations')

const IS_OFFLINE = !!process.env.IS_OFFLINE

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
    userId,
    locationId,
    startTime,
    endTime
  }) {
    if (!endTime) endTime = startTime

    this.userId = userId
    this.location = locations[locationId]
    this.tables = getTables(this.location)

    this.query = db.collection('reservations')

    if (IS_OFFLINE) {
      return
    }

    this.query = this.query
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
      if (reservation.canceled) return
      const time = reservation.reservationTime
      this.reservationsByTime[time] = this.reservationsByTime[time] || []
      this.reservationsByTime[time].push(reservation)
    })
  }

  bookedBy(time) {
    const reservations = this.reservationsByTime[time] || []
    return reservations.map(r => r.userId)
  }

  isAlreadyBookedAt(time) {
    if (this.userId) {
      const reservations = this.reservationsByTime[time] || []
      const alreadyBooked = reservations.find(r => r.userId === this.userId)
      if (alreadyBooked) return true
    }

    return false
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
