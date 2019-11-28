import React from 'react'
import styles from './styles.scss'

const RateLabel = ({ rate }) => {
  const { id, displayName } = rate
  if (!displayName) return null

  return (
    <label
      className={styles.rateName}
      data-rate={id}
    >
      {displayName}
    </label>
  )
}

export default RateLabel