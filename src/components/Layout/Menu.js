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

      <div className={styles.menuWrapper} data-expanded={expanded}>
        <div className={styles.overlay} onClick={() => setExpanded(false)} />
        <div className={styles.menu} data-expanded={expanded}>
          <ul data-row>
            <li>
              <Link to="/reserve/0" data-link>Reserve a Table</Link>
            </li>

            <li>
              <Link to={'/account'} data-link>My Account</Link>
            </li>

            {authContainer.userId ? (
              <li>
                <button onClick={authContainer.logout} data-link>Log Out</button>
              </li>
            ) : (
              <li>
                <Link to={`/login?redirect=${window.location}`} data-link>Log In</Link>
              </li>
            )}
          </ul>

          <div className={styles.close} onClick={() => setExpanded(false)}>
            ✕
          </div>
        </div>
      </div>
    </>
  )
}

export default Menu