const db = require('./util/db')

const getReservations = async (req, res) => {
  const { 
    userId, 
    locationId,
    reservationTime,
  } = req.body

  // Get location, and check availability.
  let query = db.collection('reservations')

  if (userId !== undefined) {
    query = query.where('userId', '==', userId)
  }

  if (locationId !== undefined) {
    query = query.where('locationId', '==', locationId)
  }

  if (reservationTime !== undefined) {
    query = query.where('reservationTime', '==', reservationTime)
  }

  try {
    const result = await query.get()
    const reservations = []

    if (result.docs) {
      result.docs.forEach(doc => {
        reservations.push(doc.data())
      })
    }
    
    res.status(200).json({
      reservations
    })
  } catch(err) {
    res.status(500).send('Failed to get reservations.')
    return
  }
}

module.exports = getReservations