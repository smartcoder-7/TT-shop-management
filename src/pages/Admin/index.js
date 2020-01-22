import React, { useState, useEffect } from 'react'
import { Link, withRouter } from 'react-router-dom'
import qs from 'qs'

import Layout from 'components/Layout'
import Logo from 'components/Logo'
import LocationOverview from './LocationOverview'
import UsersOverview from './UsersOverview'
import locations from '../../../locations'

import styles from './styles.scss'

const Admin = ({ children }) => {
  return (
    <Layout className={styles.admin}>
      <div data-row="full">
        <div className={styles.intro} data-col={12}>
          <h1>
            <Link to="/admin">
              <Logo className={styles.logo} theme="pink" />
              ADMIN
            </Link>
          </h1>
        </div>

        <div className={styles.content} data-col={12}>
          {children}
        </div>
      </div>
    </Layout>
  )
}

export const Home = () => {
  return (
    <Admin>
      <div className={styles.linkGroup}>
        <label className={styles.header}>Reservations by Location</label>
        <ul>
          {Object.keys(locations).map(key => (
            <li key={key}>
              <Link to={`/admin/location/${key}`} data-link>
                {locations[key].displayName}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <br />
      <br />

      <div className={styles.linkGroup}>
        <label className={styles.header}>Users</label>
        <ul>
          <li>
            <Link to="/admin/users" data-link>
              All Users
            </Link>
          </li>
        </ul>
      </div>

    </Admin>
  )
}

export const Location = withRouter(({ match: { params } }) => {
  const locationId = params.locationId || '0'

  return (
    <Admin>
      <LocationOverview locationId={locationId} />
    </Admin>
  )
})


export const Users = withRouter(() => {

  return (
    <Admin>
      <UsersOverview />
    </Admin>
  )
})

export default withRouter(Admin)
