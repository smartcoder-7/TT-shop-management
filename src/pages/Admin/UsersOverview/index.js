import React, { useState, useEffect } from 'react'
const moment = require('moment-timezone')
import uuid from 'uuid'
import authContainer from 'containers/authContainer'
import FilterableTable from 'react-filterable-table'

import styles from './styles.scss'
import { parseTime } from 'shared/datetime';
import useUsers from '../useUsers'
import EditUser from './UserDetails'

const UserOverview = () => {
  const { users } = useUsers()

  const orderedUsers = users.sort((a, b) => {
    if (!a.lastName) return 1
    if (!b.lastName) return -1
    const aName = (a.lastName || '').toUpperCase()
    const bName = (b.lastName || '').toUpperCase()
    return aName >= bName ? 1 : -1
  })

  const data = users
    .map(u => ({
      ...u,
      isMember: !!u.isMember,
      isAdmin: !!u.isAdmin,
      hasBetaAccess: !!u.hasBetaAccess,
      hasActiveCard: !!u.hasActiveCard,
    }));

  console.log(data)

  const renderDate = ({ value }) => {
    const m = moment(new Date(value)).tz('America/New_York')
    return m.format('MM-DD-YYYY')
  }

  const renderBoolean = ({ value }) => {
    return (
      <span className={styles.boolean} value={!!value}>
        {(!!value).toString()}
      </span>
    )
  }

  const renderEdit = ({ value }) => {
    const user = users.find(u => u.id === value)
    return <EditUser user={user} />
  }

  const fields = [
    { name: 'id', displayName: "Edit", render: renderEdit },
    { name: 'firstName', displayName: "First Name", inputFilterable: true, sortable: true },
    { name: 'lastName', displayName: "Last Name", inputFilterable: true, sortable: true },
    { name: 'email', displayName: "Email", inputFilterable: true, sortable: true },
    { name: 'createdAt', displayName: "Joined", inputFilterable: true, exactFilterable: true, sortable: true, render: renderDate },
    { name: 'hasActiveCard', displayName: "Active Card", sortable: true, exactFilterable: true, render: renderBoolean },
    { name: 'isAdmin', displayName: "Admin", sortable: true, exactFilterable: true, render: renderBoolean },
    { name: 'isMember', displayName: "Member", sortable: true, exactFilterable: true, render: renderBoolean },
    { name: 'hasBetaAccess', displayName: "Has Beta", sortable: true, exactFilterable: true, render: renderBoolean },

  ];

  return (
    <div className={styles.userOverview}>
      <FilterableTable
        namespace="Users"
        initialSort="lastName"
        data={data}
        fields={fields}
        noRecordsMessage="There are no users to display"
        noFilteredRecordsMessage="No users match your filters."
        pageSize={15}
        pageSizes={null}
      />

      {/* <table className={styles.users}>
        <thead>
          <tr>
            <th className={styles.lastName}>Last Name</th>
            <th className={styles.firstName}>First Name</th>
            <th className={styles.email}>Email</th>
            <th className={styles.createdAt}>Joined</th>
            <th>Active Card</th>
            <th>Member</th>
            <th>Admin</th>
            <th>Beta Access</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {orderedUsers.map(user => (
            <UserDetails key={user.id} user={user} />
          ))}
        </tbody>
      </table> */}
    </div>
  )
}

export default UserOverview
