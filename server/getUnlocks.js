const _getUnlocks = require('./util/getUnlocks')

const getUnlocks = async (req, res) => {
  const {
    userId,
    reservationId
  } = req.body

  try {
    const unlocks = await _getUnlocks({ userId, reservationId })
    res.status(200).json(unlocks)
  } catch (err) {
    res.status(500).send(err.message)
    return
  }
}

module.exports = getUnlocks
