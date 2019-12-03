import React, { useState, useEffect } from 'react'

import styles from './styles.scss'
import authContainer from 'containers/authContainer'
import Card from './Card'
import UserBadge from './UserBadge'

const ActiveCard = () => {
  const [loading, setLoading] = useState(true)
  const { user, userBilling } = authContainer

  useEffect(() => {
    if (!user.hasActiveCard) {
      setLoading(false)
      return
    }

    if (userBilling) {
      setLoading(false)
    }
  }, [user, userBilling])

  const cards = userBilling ? userBilling.sources.data : []
  const defaultCard = cards[0]

  if (!user.hasActiveCard) {
    return (
      <label className={styles.error}>
        <span className={styles.emoji}>❗️</span>
        Missing Payment Method
      </label>
    )
  }

  return (
    <UserBadge emoji='💳'>
      {loading ? <Card /> : <Card {...defaultCard} />}
    </UserBadge>
  )
}

export default ActiveCard