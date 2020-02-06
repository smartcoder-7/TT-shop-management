import React from "react"
import getReservationRanges from 'shared/getReservationRanges'

import { ReservationRange } from './ReservationRange'

const Reservations = ({
  invites = [],
  reservations = [],
  reservationClass,
  reverse = false,
  RangeComponent = ReservationRange
}) => {
  let reservationRanges = getReservationRanges(reservations)
  let inviteRanges = getReservationRanges(invites.map(i => i.reservation))

  let ranges = [...reservationRanges, ...inviteRanges]
    .sort((a, b) => a.startTime < b.startTime ? -1 : 1)

  if (reverse) ranges = ranges.reverse()

  return (
    <div>
      {ranges.map((range, i) => (
        <RangeComponent
          reservations={range}
          reservationClass={reservationClass}
          key={i}
        />
      ))}
    </div>
  )
}

export default Reservations
