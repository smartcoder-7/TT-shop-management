const sgMail = require('@sendgrid/mail')
const { db } = require('./firebase')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendEmail = async ({
  userId,
  data,
  ...rest
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

  const bcc = process.env.NODE_ENV === 'production'
    ? ['max@pingpod.com', 'ernesto@pingpod.com', 'david@pingpod.com', 'christine@pingpod.com']
    : ['christine@pingpod.com']

  const userIndex = bcc.indexOf(user.email)
  if (userIndex > -1) bcc.splice(userIndex, 1)

  const msg = {
    to: user.email,
    from: 'info@pingpod.com',
    personalizations: [{
      to: user.email,
      bcc,
      dynamic_template_data: {
        ...data,
        user
      }
    }],
    ...rest,
  }

  try {
    await sgMail.send(msg)
  } catch (err) {
    console.log(err.response.body.errors)
    throw err.message
  }
}

module.exports = sendEmail
