const _sendEmail = require('./util/sendEmail')

const sendEmail = async (req, res) => {
  const {
    userId,
    ...rest
  } = req.body

  try {
    await _sendEmail({
      userId,
      ...rest
    })
  } catch (err) {
    console.log(err)
    res.status(500).send(err)
    return
  }

  res.status(200)
}

module.exports = sendEmail
