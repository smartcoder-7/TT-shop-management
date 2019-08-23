import React from 'react'
import classNames from 'classnames'

import styles from './styles.scss'

export const ScheduleSession = ({ 
  id, 
  isAvailable,
  isSelected,
  onClick
}) => {
  return (
    <div 
      data-available={isAvailable}
      data-selected={isSelected}
      className={classNames(styles.session, styles.scheduleSession)} 
      onClick={onClick}
    >
      <div>
        {id}
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