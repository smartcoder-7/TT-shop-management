import React, { useState, useEffect } from 'react'

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
      <UserBadge emoji='❗️'>
        <span data-error>Missing Payment Method</span>
      </UserBadge>
    )
  }

  return (
    <UserBadge emoji='💳'>
      {loading ? <Card /> : <Card {...defaultCard} />}
    </UserBadge>
  )
}

export default ActiveCard