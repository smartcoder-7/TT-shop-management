import React from 'react'
import { Link } from 'react-router-dom'
import classnames from 'classnames'
import authContainer from '../../containers/authContainer'

import styles from './styles.scss'

const Layout = ({
  className,
  children
}) => {
  console.log(authContainer.state.user)
  return (
    <div className={classnames(styles.layout, className)}>
      <header>
        <h1>
          PINGPOD
        </h1>

        <h4>Logged in as: {authContainer.state.user.email}</h4>

        <Link to="/login">Log In</Link>
      </header>

      <main className={styles.content}>
        {children}
      </main>
    </div>
  )
}

export default Layout