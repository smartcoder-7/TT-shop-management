const _isEqual = require('lodash/isEqual')
const { INTERVAL_MS } = require('../shared/constants')

const hasSameInvites = (a, b) => {
  if (!a.invites && !b.invites) return true
  if (!a.invites !== !b.invites) return false
  if (a.invites.length !== b.invites.length) return false
  const aIds = a.invites.map(i => i.tokenId).sort()
  const bIds = b.invites.map(i => i.tokenId).sort()
  return _isEqual(aIds, bIds)
}

const getReservationRanges = reservations => {
  const sortedReservations = reservations.sort((a, b) => {
    return a.reservationTime > b.reservationTime ? 1 : -1
  })

  let ranges = []

  sortedReservations.forEach((res, i) => {
    const prevRes = sortedReservations[i - 1]
    const isContiguous =
      prevRes &&
      prevRes.error === res.error &&
      prevRes.locationId === res.locationId &&
      res.reservationTime <= prevRes.reservationTime + INTERVAL_MS &&
      prevRes.isPremium === res.isPremium &&
      hasSameInvites(prevRes, res)

    if (isContiguous) {
      ranges[ranges.length - 1].push(res)
      return
    }

    ranges.push([res])
  })

  return ranges
}

const getInviteRanges = invites => {
  const reservations = invites.map(i => ({
    ...i.reservation,
    inviteId: i.id
  }))

  return getReservationRanges(reservations)
}

module.exports = { getReservationRanges, getInviteRanges }