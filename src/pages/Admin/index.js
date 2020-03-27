import React, { useState, useEffect } from 'react'
import { Link, withRouter } from 'react-router-dom'
import qs from 'qs'

import Layout from 'components/Layout'
import Logo from 'components/Logo'
import ReservationsByLocation from './Reservations/ReservationsByLocation'
import UsersOverview from './UsersOverview'
import ReservationsOverview from './Reservations'
import ProductsOverview from './Products'
import locations from '../../../locations'

import styles from './styles.scss'
import { UsersProvider } from './useUsers'

const Admin = ({ children }) => {
  return (
    <UsersProvider>
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
    </UsersProvider>
  )
}

export const Home = () => {
  return (
    <Admin>
      <div className={styles.linkGroup}>
        <label className={styles.header}>Reservations</label>
        <ul>
          <li>
            <Link to="/admin/reservations" data-link>
              All Reservations
            </Link>
          </li>
          {Object.keys(locations).map(key => (
            <li key={key}>
              <Link to={`/admin/reservations/${key}`} data-link>
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

      <br />
      <br />

      <div className={styles.linkGroup}>
        <label className={styles.header}>Products</label>
        <ul>
          <li>
            <Link to="/admin/products" data-link>
              All Products
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
      <ReservationsByLocation locationId={locationId} />
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

export const Products = withRouter(() => {
  return (
    <Admin>
      <ProductsOverview />
    </Admin>
  )
})

export const Reservations = withRouter(() => (
  <Admin><ReservationsOverview /></Admin>
))

export default withRouter(Admin)
