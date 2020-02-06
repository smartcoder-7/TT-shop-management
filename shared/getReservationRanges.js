const { INTERVAL_MS } = require('../shared/constants')

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
      res.reservationTime <= prevRes.reservationTime + INTERVAL_MS &&
      prevRes.isPremium === res.isPremium

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