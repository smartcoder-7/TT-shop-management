const AvailabilityCheck = require('./util/AvailiabilityCheck')
const getAllSessions = require('../shared/getAllSessions')

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
    userId,
    locationId,
    startTime,
    endTime
  } = req.body
  try {
    const sessions = getAllSessions({
      locationId,
      startTime,
      endTime
    })

    const check = new AvailabilityCheck({ userId, locationId, startTime, endTime })
    await check.run()

    const availableSessions = sessions.map(time => {
      return {
        startTime: time,
        bookedBy: check.bookedBy(time),
        alreadyBooked: check.isAlreadyBookedAt(time),
        tablesLeft: check.anyTablesLeftAt(time),
        regularTablesLeft: check.regularTablesLeftAt(time),
        premiumTablesLeft: check.premiumTablesLeftAt(time)
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
