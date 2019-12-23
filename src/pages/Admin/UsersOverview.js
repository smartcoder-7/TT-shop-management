import React, { useState, useEffect } from 'react'
import DayPicker from 'components/DayPicker'
import RateLabel from 'components/RateLabel'
import getAllSessions from '../../../shared/getAllSessions'

import styles from './styles.scss'
import { getReservations } from 'api'
import ReservationDetails from './ReservationDetails'
import locations from '../../../locations.json'
import { parseTime } from '../../util/datetime';
import { getUsers } from '../../api';

const IS_DEV = process.env.NODE_ENV === 'development'

const User = ({ user }) => {
  const { year, monthAbbr } = parseTime(user.createdAt)
  const name = `${user.firstName} ${user.lastName}`
  const createdAt = `${monthAbbr} ${year}`

  return (
    <tr className={styles.user}>
      <td className={styles.name}>{name}</td>
      <td className={styles.createdAt}>{createdAt}</td>
      <td className={styles.createdAt}>{(!!user.hasActiveCard).toString()}</td>
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
            <th div className={styles.name}>Name</th>
            <th div className={styles.createdAt}>Joined</th>
            <th>Active Card</th>
          </tr>
        </thead>

        <tbody>
          {orderedUsers.map(user => (
            <User key={user.id} user={user} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default UserOverview
