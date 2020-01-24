const SESSION_LENGTH = 1000 * 60 * 30
const UNLOCK_THRESHOLD = 1000 * 60 * 30

const getUnlockTime = ({ startTime }) => {
  return startTime - UNLOCK_THRESHOLD
}

const unlockStarted = ({ startTime }) => {
  const now = Date.now()
  return now >= (startTime - UNLOCK_THRESHOLD)
}

const unlockEnded = ({ endTime }) => {
  const now = Date.now()
  return now >= endTime
}

const canUnlock = ({ reservationTime }) => {
  const startTime = reservationTime
  const endTime = startTime + SESSION_LENGTH
  return unlockStarted({ startTime }) && !unlockEnded({ endTime })
}

module.exports = {
  canUnlock,
  getUnlockTime,
  unlockStarted,
  unlockEnded
}