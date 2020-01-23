import React, { useState, useEffect } from 'react'
import uuid from 'uuid'
import DayPicker from 'components/DayPicker'
import RateLabel from 'components/RateLabel'
import authContainer from 'containers/authContainer'
import getAllSessions from '../../../shared/getAllSessions'

import styles from './styles.scss'
import { getReservations } from 'api'
import ReservationDetails from './ReservationDetails'
import locations from '../../../locations'
import { parseTime } from '../../util/datetime';
import { getUsers, updateUserInfo } from '../../api';

const IS_DEV = process.env.NODE_ENV === 'development'

const POLL_INTERVAL = 10000

const Toggle = ({ className, onToggle, refetch, value }) => {
  const [loading, setLoading] = useState(false)

  const toggle = () => {
    if (loading) return
    setLoading(true)
    onToggle()
      .finally(() => {
        refetch().then(() => {
          setLoading(false)
        })
      })
  }

  return (
    <td className={className} data-label onClick={toggle}>
      {!loading && value}
      {loading && '...'}
    </td>
  )
}

const User = ({ user, refetch }) => {
  const hasActiveCard = !!user.hasActiveCard
  const membership = user.isMember ? 'Member' : ''
  const role = user.isAdmin ? 'Admin' : ''
  let createdAt = ''

  try {
    const { year, monthAbbr } = parseTime(user.createdAt)
    createdAt = `${monthAbbr} ${year}`
  } catch (err) {
    createdAt = '-'
  }

  const toggleMember = () => updateUserInfo({ userId: user.id, isMember: !user.isMember })
  const toggleAdmin = () => {
    if (user.id === authContainer.userId) return Promise.resolve()
    return updateUserInfo({ userId: user.id, isAdmin: !user.isAdmin })
  }

  return (
    <tr className={styles.user}>
      <td className={styles.lastName}>{user.lastName}</td>
      <td className={styles.firstName}>{user.firstName}</td>
      <td className={styles.email}>{user.email}</td>
      <td className={styles.createdAt}>{createdAt}</td>
      <td className={styles.activeCard} data-label data-active={hasActiveCard}>
        {hasActiveCard.toString()}
      </td>
      <Toggle className={styles.status} onToggle={toggleMember} value={membership} refetch={refetch} />
      <Toggle className={styles.status} onToggle={toggleAdmin} value={role} refetch={refetch} />
    </tr>
  )
}

const UserOverview = () => {
  const [users, setUsers] = useState([])

  const populate = () => {
    return getUsers()
      .then(setUsers)
  }

  useEffect(() => {
    populate()
    const interval = setInterval(populate, POLL_INTERVAL)

    return () => clearInterval(interval)
  }, [])

  const orderedUsers = users.sort((a, b) => {
    if (!a.lastName) return 1
    if (!b.lastName) return -1
    const aName = (a.lastName || '').toUpperCase()
    const bName = (b.lastName || '').toUpperCase()
    return aName >= bName ? 1 : -1
  })

  return (
    <div className={styles.userOverview}>

      <table className={styles.users}>
        <thead>
          <tr>
            <th className={styles.lastName}>Last Name</th>
            <th className={styles.firstName}>First Name</th>
            <th className={styles.email}>Email</th>
            <th className={styles.createdAt}>Joined</th>
            <th>Active Card</th>
            <th>Membership</th>
            <th>Role</th>
          </tr>
        </thead>

        <tbody>
          {orderedUsers.map(user => (
            <User key={user.id || uuid()} user={user} refetch={populate} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default UserOverview
