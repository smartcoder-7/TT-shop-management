import React from 'react'
import classNames from 'classnames'

import styles from './styles.scss'
import { parseSession } from 'util/getPodSessions';
import getDateParts from 'util/getDateParts'

const with0 = n => n < 10 ? `0${n}` : n

// TODO: Deal with timezones!!
const formatTime = (time) => {
  const date = new Date(time)
  const hour = date.getHours()
  const minutes = date.getMinutes()

  let hour12 = hour % 12
  hour12 = hour12 === 0 ? 12 : hour12
  const ampm = hour < 12 ? 'AM' : 'PM'
  return `${with0(hour12)}:${with0(minutes)} ${ampm}`
}

export const RateLabel = ({ rate, showEmpty }) => {
  if (!showEmpty && !rate.name) return null

  return (
    <label 
      className={styles.rateName || 'Normal'}
      data-rate={rate.name}
    >
      {rate.name || 'Normal'}
    </label>
  )
}

export const ScheduleSession = ({ 
  id, 
  isAvailable,
  isPast,
  isSelected,
  onClick,
  rate
}) => {
  const { time, timeEnd } = parseSession(id)

  return (
    <div 
      data-available={isAvailable}
      data-past={isPast}
      data-selected={isSelected}
      className={classNames(styles.session, styles.scheduleSession)} 
      onClick={onClick}
    >
      <div className={styles.check}>✔</div>
      <div className={styles.sessionInfo}>
        {!isAvailable && !isPast && <div data-label>UNAVAILABLE</div>} 
        <label>{formatTime(time)} - {formatTime(timeEnd)}</label>
        <RateLabel rate={rate} />
      </div>
    </div>
  )
}

export const CartSession = ({ 
  id, 
  isAvailable,
  isSelected,
  onXClick
}) => {
  const { date, time, timeEnd } = parseSession(id)

  const { month, dayOfTheWeek, day, year } = getDateParts(new Date(time))

  return (
    <div 
      data-available={isAvailable}
      data-selected={isSelected}
      className={classNames(styles.session, styles.cartSession)} 
    >
      <div>
        <label>{dayOfTheWeek}, {month} {day}, {year}</label>
        <br />
        <label>{formatTime(time)} - {formatTime(timeEnd)}</label>
      </div>
      
      <div className={styles.remove} onClick={onXClick}>✕</div>
    </div>
  )
}

export const AccountSession = ({ 
  id, 
  isAvailable,
}) => {
  const { time, timeEnd, locationId } = parseSession(id)

  return (
    <div 
      className={classNames(styles.session, styles.accountSession)} 
    >
      <div>
        <p>Location: {locationId}</p>
        {formatTime(time)} - {formatTime(timeEnd)}
      </div>
    </div>
  )
}