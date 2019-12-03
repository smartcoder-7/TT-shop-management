import React from 'react'

import { getDateParts } from 'util/datetime'
import authContainer from 'containers/authContainer'
import UserBadge from 'components/User/UserBadge'
import ActiveCard from './ActiveCard'


const UserBadges = () => {
  const { user } = authContainer

  const format = d => {
    const { monthAbbr, year } = getDateParts(d)
    return `${monthAbbr} ${year}`
  }

  return (
    <>
      <UserBadge emoji='⭐️'>Member</UserBadge>
      <ActiveCard />
      <UserBadge emoji='🏓'>Joined {format(user.createdAt)}</UserBadge>
    </>
  )
}

export default UserBadges