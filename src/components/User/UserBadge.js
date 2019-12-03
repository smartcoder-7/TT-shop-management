import React from 'react'
import styles from './styles.scss'

const UserBadge = ({ emoji, children }) => (
  <label className={styles.userBadge}>
    <span className={styles.emoji}>{emoji}</span>
    <span>
      {children}
    </span>
  </label>
)

export default UserBadge