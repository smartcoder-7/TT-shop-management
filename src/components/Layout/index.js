import React from 'react'
import { Link } from 'react-router-dom'
import classnames from 'classnames'
import authContainer from '../../containers/authContainer'

import styles from './styles.scss'

const Layout = ({
  className,
  children
}) => {
  return (
    <div className={classnames(styles.layout, className)}>
      <header>
        <ul>
          <li data-link>
            <Link to="/">PINGPOD</Link>
          </li>

          <li data-link>
            <Link to={`/login?redirect=${window.location}`}>Log In</Link>
          </li>

          <li data-link>
            <button data-plain onClick={authContainer.logout}>Log Out</button>
          </li>
        </ul>
        <h4>Logged in as: {authContainer.user.email}</h4>


      </header>

      <main className={styles.content}>
        {children}
      </main>
    </div>
  )
}

export default Layout