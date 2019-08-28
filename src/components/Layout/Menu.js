import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import classnames from 'classnames'
import authContainer from '../../containers/authContainer'

import styles from './styles.scss'

const Menu = ({
  children
}) => {
  const [expanded, setExpanded] = useState(false)

  return (
    <>
      <div className={styles.menuTrigger} onClick={() => setExpanded(true)}>
        <div className={styles.dot}/>
        <div className={styles.dot}/>
        <div className={styles.dot}/>
      </div>

      <div className={styles.menu} data-expanded={expanded}>
        <ul data-row>
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

        <div className={styles.close} onClick={() => setExpanded(false)}>
          X
        </div>
      </div>
    </>
  )
}

export default Menu