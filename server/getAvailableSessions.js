const { db } = require('./util/firebase')
const getAllSessions = require('../shared/getAllSessions')
const locations = require('../locations.json')

const IS_OFFLINE = process.env.IS_OFFLINE

/*
  Returns all session availability: 
  [{ 
    startTime: Number (Timestamp),
    tablesLeft: Number,
    premiumTablesLeft: Number
  }]
*/

const getAvailableSessions = async (req, res) => {
  const {
    locationId,
    startTime,
    endTime
  } = req.body
  try {
    // Get location, and check availability.
    let query = db.collection('reservations')

    if (!IS_OFFLINE) {
      query = query
        .where('locationId', '==', locationId)
        .where('reservationTime', '>=', startTime)
        .where('reservationTime', '<=', endTime)
    }

    const result = await query.get()

    const allBookings = {}

    if (result.docs) {
      result.docs.forEach(doc => {
        const docData = doc.data()
        const time = docData.reservationTime
        allBookings[time] = allBookings[time] || []
        allBookings[time].push(docData)
      })
    }

    const sessions = getAllSessions({
      locationId,
      startTime,
      endTime
    })

    const location = locations[locationId]

    const availableSessions = sessions.map(time => {
      const bookings = allBookings[time] || []
      const totalTables = location.tables.length
      const totalPremiumTables = location.tables.filter(b => b.isPremium).length
      const totalBookings = bookings.length
      const premiumBookings = bookings.filter(b => b.isPremium).length

      const tablesLeft = totalTables - totalBookings
      const premiumTablesLeft = totalPremiumTables - premiumBookings

      return {
        startTime: time,
        tablesLeft,
        premiumTablesLeft
      }
    })

    res.status(200).json({
      sessions: availableSessions
    })
  } catch (err) {
    res.status(500).send(`Failed to get reservations: ${err.message}`)
    return
  }
}

module.exports = getAvailableSessions
