import React from 'react'
import styles from './styles.scss'

const RateLabel = ({ rate, showEmpty }) => {
  const { id, displayName } = rate
  if (!showEmpty && !displayName) return null

  return (
    <label
      className={styles.rateName}
      data-rate={id}
    >
      {displayName || 'Normal'}
    </label>
  )
}

export default RateLabel
