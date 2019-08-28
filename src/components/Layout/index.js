import React from 'react'
import { Link } from 'react-router-dom'
import classnames from 'classnames'
import authContainer from '../../containers/authContainer'

import styles from './styles.scss'
import Menu from './Menu'
import Logo from '../Logo'

const Layout = ({
  className,
  children
}) => {  
  return (
    <div className={classnames(styles.layout, className)}>
      <header>
        <ul>
          <li>
            <Link to="/">
              <Logo className={styles.logo} />
            </Link>
          </li>
        </ul>
        <Menu />
      </header>

      <main>
        <div className={styles.content}>
          {children}
        </div>
      </main>
    </div>
  )
}

export default Layout