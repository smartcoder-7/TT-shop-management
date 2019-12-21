const _chargeReservations = require('./util/chargeReservations')

const chargeReservations = async (req, res) => {
  const {
    reservations = []
  } = req.body

  const charged = await _chargeReservations({ reservations })

  res.status(200).json({
    success: true,
    ...charged
  })
}

module.exports = chargeReservations
