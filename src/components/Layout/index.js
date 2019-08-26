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
          <li>
            <Link to="/" data-link>PINGPOD</Link>
          </li>

          <li>
            <Link to={`/login?redirect=${window.location}`} data-link>Log In</Link>
          </li>

          <li>
            <Link to={'/account'} data-link>Account</Link>
          </li>

          <li>
            <button onClick={authContainer.logout} data-link>Log Out</button>
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