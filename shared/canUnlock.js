const SESSION_LENGTH = 1000 * 60 * 60 * 30
const UNLOCK_THRESHOLD = 1000 * 60 * 60 * 10

const canUnlock = (reservation) => {
  const { startTime } = reservation

  const endTime = startTime + SESSION_LENGTH
  const now = Date.now()
  const isTooEarly = now < (startTime - UNLOCK_THRESHOLD)
  const isTooLate = now > endTime

  if (isTooEarly || isTooLate) {
    return false
  }

  return true
}


module.exports = canUnlock