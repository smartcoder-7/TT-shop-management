import React from 'react'
import styles from './styles.scss'

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
