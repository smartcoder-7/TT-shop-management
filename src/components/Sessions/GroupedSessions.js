import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

import styles from './styles.scss'
import { ReservationRange } from 'components/Reservation'
import { INTERVAL_MS } from 'util/getPodSessions'
import getDateParts from 'shared/getDateParts'
import { formatTime } from 'util/getPodSessions'
import getSessionPrice from 'shared/getSessionPrice';

const ReservationsPerDate = ({ date, times, locationId, reservations, inCart }) => {
  const ranges = []

  times.forEach((t, i) => {
    const time = parseInt(t)
    const end = time + INTERVAL_MS
    const lastRange = ranges[ranges.length - 1]

    const lastTime = times[i - 1]
    if (lastTime && time - lastTime === INTERVAL_MS) {
      lastRange.end = end
      lastRange.times.push(time)
      return
    }

    ranges.push({ 
      start: time, 
      end,
      times: [time]
    })
  })

  const {
    dayOfTheWeek,
    month,
    day,
    year
  } = getDateParts(new Date(date))
  
  return (
    <div className={styles.reservationDate} key={date}>

      <p className={styles.date} data-label>
        {dayOfTheWeek}, {month} {day}, {year}
      </p>

      {ranges.map(({ start, end, times }) => {
        const allReservations = times.map(time => {
          return {
            time,
            reservations: reservations[date][time]
          }
        })

        let cost = 0
        times.forEach(time => {
          const rate = getSessionPrice({ time })
          cost += rate.price.NON_MEMBER / 2
        })

        if (inCart) {
          return (
            <div key={start} className={styles.session}>
              <p>{formatTime(start)} - {formatTime(end)}</p>
              ${cost}

              <label className={styles.edit}>
                <Link to={`/reserve/0?time=${start}`}>
                  Edit
                </Link>
              </label>
            </div>
          )
        }

        return (
          <ReservationRange 
            key={start} 
            start={start} 
            end={end} 
            tables={allReservations} 
          />
        )
      })}
    </div>
  )
}

const GroupedSessions = ({ 
  sessions = {},
  inCart = false
}) => {
  const locations = Object.keys(sessions)

  return (
    <div className="user-reservations">
      {locations.map(locationId => {
        const location = sessions[locationId] || {}
        const reservationDates = Object.keys(location)

        return reservationDates
        .sort()
        .reverse()
        .map(date => {
          const times = Object.keys(location[date] || {})
          console.log(times)

          return (
            <ReservationsPerDate 
              key={date}
              date={date} 
              times={times.sort()} 
              locationId={locationId}
              reservations={location}
              inCart={inCart}
            />
          )
        })
      })}
    </div>
  )
}

export default GroupedSessions
