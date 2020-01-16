const SESSION_LENGTH = 1000 * 60 * 30
const UNLOCK_THRESHOLD = 1000 * 60 * 30

const getUnlockTime = (reservation) => {
  const { reservationTime } = reservation
  return reservationTime - UNLOCK_THRESHOLD
}

const canUnlock = (reservation) => {
  const { reservationTime } = reservation

  const endTime = reservationTime + SESSION_LENGTH
  const now = Date.now()

  const isTooEarly = now < (reservationTime - UNLOCK_THRESHOLD)
  const isTooLate = now > endTime

  if (isTooEarly || isTooLate) {
    return false
  }

  return true
}

module.exports = {
  canUnlock,
  getUnlockTime
}