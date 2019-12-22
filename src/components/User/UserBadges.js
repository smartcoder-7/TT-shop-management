import React from 'react'

import authContainer from 'containers/authContainer'
import UserBadge from 'components/User/UserBadge'
import ActiveCard from './ActiveCard'
import { parseTime } from 'util/datetime'


const UserBadges = () => {
  const { user } = authContainer

  console.log(user)

  const format = d => {
    const { monthAbbr, year } = parseTime(d, 'America/New_York')
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
