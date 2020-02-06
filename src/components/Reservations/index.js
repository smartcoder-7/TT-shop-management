import React from "react"
import { getReservationRanges, getInviteRanges } from 'shared/getReservationRanges'

import { ReservationRange } from './ReservationRange'

const Reservations = ({
  invites = [],
  reservations = [],
  reservationClass,
  reverse = false,
  RangeComponent = ReservationRange
}) => {
  let reservationRanges = getReservationRanges(reservations)
  let inviteRanges = getInviteRanges(invites)

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
