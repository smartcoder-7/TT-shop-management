const sgMail = require('@sendgrid/mail')
const { db } = require('./firebase')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendEmail = async ({
  userId,
  subject,
  text,
  html = text
}) => {
  let userRef, user

  try {
    userRef = db.collection('users').doc(userId)
    const userDoc = await userRef.get()
    user = userDoc.data() || {}
  } catch (err) {
    throw 'Cannot reach server.'
  }

  if (!user.email) {
    throw 'User does not have an email.'
  }

  const msg = {
    to: user.email,
    from: 'info@pingpod.com',
    subject,
    text,
    html,
  }

  sgMail.send(msg)
}

module.exports = sendEmail
