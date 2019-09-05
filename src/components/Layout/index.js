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
      <header data-row>
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
        <div className={styles.content} data-row>
          <div data-col="12">
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}

export default Layout