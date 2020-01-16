import React, { useState, useEffect } from 'react'
import uuid from 'uuid'
import DayPicker from 'components/DayPicker'
import RateLabel from 'components/RateLabel'
import getAllSessions from '../../../shared/getAllSessions'

import styles from './styles.scss'
import { getReservations } from 'api'
import ReservationDetails from './ReservationDetails'
import locations from '../../../locations'
import { parseTime } from '../../util/datetime';
import { getUsers } from '../../api';

const IS_DEV = process.env.NODE_ENV === 'development'

const User = ({ user }) => {
  const hasActiveCard = !!user.hasActiveCard
  let createdAt = ''

  try {
    const { year, monthAbbr } = parseTime(user.createdAt)
    createdAt = `${monthAbbr} ${year}`
  } catch (err) {
    console.warn(err)
  }


  return (
    <tr className={styles.user}>
      <td className={styles.firstName}>{user.firstName}</td>
      <td className={styles.lastName}>{user.lastName}</td>
      <td className={styles.email}>{user.email}</td>
      <td className={styles.createdAt}>{createdAt}</td>
      <td className={styles.activeCard} data-active={hasActiveCard}>
        {hasActiveCard.toString()}
      </td>
    </tr>
  )
}

const UserOverview = () => {
  const [users, setUsers] = useState([])

  useEffect(() => {
    getUsers()
      .then(setUsers)
  }, [])

  const orderedUsers = users.sort((a, b) => {
    return a.lastName > b.lastName ? 1 : -1
  })

  return (
    <div className={styles.userOverview}>

      <table className={styles.users}>
        <thead>
          <tr>
            <th className={styles.firstName}>First Name</th>
            <th className={styles.lastName}>Last Name</th>
            <th className={styles.email}>Email</th>
            <th className={styles.createdAt}>Joined</th>
            <th>Active Card</th>
          </tr>
        </thead>

        <tbody>
          {orderedUsers.map(user => (
            <User key={user.id || uuid()} user={user} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default UserOverview
