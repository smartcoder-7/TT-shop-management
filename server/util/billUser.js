const stripe = require('./stripe')
const { db } = require('./firebase')
const slack = require('./slack')
const users = require('../users')
const reservations = require('../reservations')
const { getReservationRanges } = require('../../shared/getReservationRanges')
const parseReservationRange = require('../../shared/parseReservationRange')
const getReservationCost = require('../../shared/getReservationCost')
const chargeUser = require('./chargeUser')

const MIN_10 = 1000 * 60 * 10
const maxTime = Date.now() + MIN_10

const billUser = async ({ userId }) => {
  const user = await users.get(userId)
  const allReservations = await reservations.search({
    rules: [
      ['userId', '==', userId]
    ]
  })

  const unpaidReservations = allReservations.filter(r => !r.chargeId && !r.canceled)
  const unpaidRanges = getReservationRanges(unpaidReservations)

  try {
    return await unpaidRanges
      .map(range => {
        const { location, date, startTime } = parseReservationRange(range)

        if (startTime > maxTime) return Promise.resolve()

        let amount = 0

        range.forEach(res => {
          const rate = getReservationCost(res)
          let amountDollars = res.customRate

          // THIS SHOULD BE REPLACED BY STATIC RATES!!

          if (typeof res.customRate === 'undefined') {
            amountDollars = user.isMember ? rate.MEMBER : rate.NON_MEMBER
          }

          if (Number.isNaN(amountDollars) || amountDollars > 100) throw 'Calculated cost is invalid.'

          const perSession = amountDollars / 2
          amount += perSession * 100
        })

        if (amount <= 0) {
          return reservations.updateMultiple(range.map(r => ({
            ...r,
            chargeId: 'FREE_OF_CHARGE',
            chargeError: null,
            lastCharged: Date.now()
          })))
        }

        return chargeUser({
          userId,
          amount,
          description: `PINGPOD: ${location.displayName} • ${date}`,
        })
          .then(charge => {
            return reservations.updateMultiple(range.map(r => ({
              ...r,
              chargeId: charge.id,
              chargeError: null,
              lastCharged: Date.now()
            })))
          })
          .catch(chargeError => {
            const raw = chargeError.raw || {}
            const message = chargeError.message || raw.message || 'Unable to charge card.'

            return reservations.updateMultiple(range.map(r => ({
              ...r,
              chargeError: message,
              lastCharged: Date.now()
            })))
          })
      })
  } catch (err) {
    throw err
  }
}

module.exports = billUser
