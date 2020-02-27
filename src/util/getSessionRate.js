import parseSessionId from 'shared/parseSessionId'
import getReservationCost from '../../shared/getReservationCost'

const getSessionRate = (sessionId) => {
  const { time, locationId } = parseSessionId(sessionId)
  const reservation = { reservationTime: time, locationId }
  return getReservationCost({ reservation })
}

export default getSessionRate
