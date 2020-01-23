const _sendEmail = require('./util/sendEmail')

const sendEmail = async (req, res) => {
  const {
    userId,
    subject,
    text,
    html
  } = req.body

  try {
    await _sendEmail({
      userId,
      subject,
      text,
      html
    })
  } catch (err) {
    res.status(500).send(err)
    return
  }

  res.status(200)
}

module.exports = sendEmail
