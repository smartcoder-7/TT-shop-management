import React, { useState, useEffect } from 'react'
const moment = require('moment-timezone')
import FilterableTable from 'react-filterable-table'

import styles from './styles.scss'
import useUsers from '../useUsers'
import EditUser from './UserDetails'

const UserOverview = () => {
  const { users } = useUsers()

  const data = users
    .map(u => ({
      ...u,
      isMember: !!u.isMember,
      isAdmin: !!u.isAdmin,
      hasActiveCard: !!u.hasActiveCard,
    }));

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
    </div>
  )
}

export default UserOverview
