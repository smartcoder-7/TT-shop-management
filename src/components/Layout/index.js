import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import classnames from 'classnames'
import authContainer from '../../containers/authContainer'

import styles from './styles.scss'
import Menu from './Menu'
import Logo from '../Logo'

const IS_DEV = process.env.NODE_ENV === 'development'

const Layout = ({
  className,
  children
}) => {
  const [scrolled, setScrolled] = useState(!!window.pageYOffset)
  useEffect(() => {
    const onScroll = () => {
      setScrolled(!!window.pageYOffset)
    }

    window.addEventListener('scroll', onScroll)

    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  })

  return (
    <div className={classnames(styles.layout, className)}>
      <div className={styles.headerWrapper} data-bg-color data-scrolled={scrolled}>
        <header data-row>
          <ul>
            <li>
              <Link to="/">
                <Logo className={styles.logo} />
              </Link>
            </li>
          </ul>

          {IS_DEV && <Menu />}
        </header>
      </div>

      <main>
        {children}
      </main>
    </div>
  )
}

export default Layout