// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = ({ 
  email = 'christine@pingpod.com', 
  text = 'Test Body', 
  subject = 'Test Title' 
}) => {
  const msg = {
    to: email,
    from: 'no-reply@pingpod.com',
    subject,
    text,
    html: `<strong>${text}</strong>`,
  };

  console.log(sgMail instanceof Promise)

  return new Promise((resolve) => {
    sgMail.send(msg, isMultiple = false, () => {
      resolve(true)
    })
  })
}

module.exports = sendEmail