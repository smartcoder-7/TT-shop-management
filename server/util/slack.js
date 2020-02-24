const axios = require('axios')
const { getReservationRanges } = require('../../shared/getReservationRanges')
const parseReservationRange = require('../../shared/parseReservationRange')
const users = require('../users')

const url = process.env.NODE_ENV === 'production'
  ? 'https://hooks.slack.com/services/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'
  : 'https://hooks.slack.com/services/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'

const Slack = () => {
  const post = (data) => {
    return axios({
      url,
      method: 'POST',
      data
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
--------------------------------
✨🏓✨
*New Reservation*
${location.displayName}
${date} • ${startTimeFormatted} - ${endTimeFormatted}
--
Booked by: ${user.firstName} ${user.lastName}
Email: ${user.email}
User ID: ${userId}
--------------------------------
    `

    console.log('hello', text, url)

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
    newReservations
  }
}

const slack = Slack()

module.exports = slack
