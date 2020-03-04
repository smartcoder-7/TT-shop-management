const axios = require('axios')
const { getReservationRanges } = require('../../shared/getReservationRanges')
const parseReservationRange = require('../../shared/parseReservationRange')
const users = require('../users')

const url = process.env.SLACK_WEBHOOK_USER_ACTIVITY
const stripeBaseUrl = process.env.NODE_ENV === 'production'
  ? 'https://dashboard.stripe.com'
  : 'https://dashboard.stripe.com/test'

const Slack = () => {
  const post = (data) => {
    return axios({
      url,
      method: 'POST',
      data
    })
  }

  const newCharge = async ({ amount, description, user, stripeCustomer }) => {
    const customerHref = `${stripeBaseUrl}/customers/${stripeCustomer.id}`

    const text = `
> ✨💵✨
> *New Charge*
> $${(amount / 100).toFixed(2)}
> ${description}
> --
> Charged to: ${user.firstName} ${user.lastName}
> Email: ${user.email}
> User ID: ${user.id}
> Stripe Customer: ${customerHref}
`

    return post({
      text
    })
  }

  const chargeError = async ({ chargeError, userId }) => {
    const text = `
> 🚫💵🚫
> *Charge Error*
> ${chargeError}
> --
> User ID: ${userId}
`

    return post({
      text
    })
  }

  const newReservationRange = async (range) => {
    const {
      location,
      date,
      startTimeFormatted,
      endTimeFormatted,
      userId
    } = parseReservationRange(range)

    const user = await users.get(userId)
    const text = `
> ✨🏓✨
> *New Reservation*
> ${location.displayName}
> ${date} • ${startTimeFormatted} - ${endTimeFormatted}
> --
> Booked by: ${user.firstName} ${user.lastName}
> Email: ${user.email}
> User ID: ${userId}
    `

    return post({
      text
    })
  }

  const newReservations = async (reservations) => {
    const ranges = getReservationRanges(reservations)

    return await Promise.all(ranges.map(newReservationRange))
  }

  return {
    post,
    newReservations,
    newCharge,
    chargeError,
  }
}

const slack = Slack()

module.exports = slack
