import React, { useState, useEffect } from 'react'
import uuid from 'uuid'
import authContainer from 'containers/authContainer'

import styles from '../styles.scss'
import { parseTime } from 'shared/datetime';
import { updateUserInfo } from '../../../api';
import useUsers from '../useUsers'
import UserDetails from './UserDetails'

const UserOverview = () => {
  const { users } = useUsers()

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
            <th>Member</th>
            <th>Admin</th>
          </tr>
        </thead>

        <tbody>
          {orderedUsers.map(user => (
            <UserDetails key={user.id} user={user} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default UserOverview
