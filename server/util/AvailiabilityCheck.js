const { db } = require('./firebase')
const locations = require('../../locations')

const IS_OFFLINE = !!process.env.IS_OFFLINE

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

    this.query = db.collection('reservations')

    if (IS_OFFLINE) {
      return
    }

    this.query = this.query
      .where('locationId', '==', locationId)
      .where('reservationTime', '>=', startTime)
      .where('reservationTime', '<=', endTime)
  }

  get numTables() {
    return this.location.tables.length
  }

  async run() {
    try {
      if (this.userId) {
        const userDoc = await db.collection('users').doc(this.userId).get()
        if (!userDoc.exists) throw { message: 'User does not exist!' }
        this.user = userDoc.data()
      }
    } catch (err) {
      throw err
    }

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

  hasAccess() {
    return !!this.location.active && !this.user.isBlocked
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
    return this.numTables - this.getReservationsAt(time)
  }
}

module.exports = AvailabilityCheck
