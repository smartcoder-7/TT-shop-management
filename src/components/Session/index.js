import React from 'react'
import classNames from 'classnames'

import styles from './styles.scss'
import { parseSession } from '../../util/getPodSessions';

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

export const ScheduleSession = ({ 
  id, 
  isAvailable,
  isSelected,
  onClick
}) => {
  const { time, timeEnd } = parseSession(id)

  return (
    <div 
      data-available={isAvailable}
      data-selected={isSelected}
      className={classNames(styles.session, styles.scheduleSession)} 
      onClick={onClick}
    >
      <div>
        {formatTime(time)} - {formatTime(timeEnd)}
        {!isAvailable && <h4>UNAVAILABLE</h4>} 
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
  return (
    <div 
      data-available={isAvailable}
      data-selected={isSelected}
      className={classNames(styles.session, styles.cartSession)} 
    >
      <div>
        {id}
        {!isAvailable && <h4>UNAVAILABLE</h4>} 
      </div>
      
      <div className={styles.remove} onClick={onXClick}>X</div>
    </div>
  )
}