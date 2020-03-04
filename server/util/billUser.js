const stripe = require('./stripe')
const { db } = require('./firebase')
const slack = require('./slack')
const users = require('../users')
const reservations = require('../reservations')
const { getReservationRanges } = require('../../shared/getReservationRanges')
const parseReservationRange = require('../../shared/parseReservationRange')
const getReservationCost = require('../../shared/getReservationCost')
const chargeUser = require('./chargeUser')
const getBillingThreshold = require('./getBillingThreshold')

const billUser = async ({ userId }) => {
  const allReservations = await reservations.search({
    rules: [
      ['userId', '==', userId]
    ]
  })

  const unpaidReservations = allReservations.filter(r => !r.chargeId && !r.canceled)
  const unpaidRanges = getReservationRanges(unpaidReservations)

  return await unpaidRanges
    .map(range => {
      const { location, date, startTime } = parseReservationRange(range)

      if (startTime > getBillingThreshold()) return Promise.resolve()

      let amount = 0

      range.forEach(res => {
        let amountDollars = res.customRate

        if (typeof res.customRate === 'undefined') {
          amountDollars = typeof res.rate !== 'undefined'
            ? res.rate
            : 10
        }

        const perSession = amountDollars / 2
        amount += perSession * 100
      })

      if (
        typeof amount !== 'number' ||
        Number.isNaN(amount)
      ) {
        const chargeError = 'Calculated cost is invalid.'

        try {
          slack.chargeError({ chargeError, userId })
        } catch (e) { console.log(e) }

        return reservations.updateMultiple({
          reservations: range.map(r => ({
            ...r,
            chargeError,
            lastCharged: Date.now()
          }))
        })
      }

      return chargeUser({
        userId,
        amount,
        description: `PINGPOD: ${location.displayName} • ${date}`,
      })
        .then(charge => {
          return reservations.updateMultiple({
            reservations: range.map(r => ({
              ...r,
              chargeId: charge.id,
              chargeError: null,
              lastCharged: Date.now()
            }))
          })
        })
        .catch(chargeError => {
          const raw = chargeError.raw || {}
          const message = chargeError.message || raw.message || 'Unable to charge card.'

          try {
            slack.chargeError({ chargeError: message, userId })
          } catch (e) { console.log(e) }

          return reservations.updateMultiple({
            reservations: range.map(r => ({
              ...r,
              chargeError: message,
              lastCharged: Date.now()
            }))
          })
        })
    })
}

module.exports = billUser
