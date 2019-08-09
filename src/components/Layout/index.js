import React from 'react'
import classnames from 'classnames'

import styles from './styles.scss'

const Layout = ({
  className,
  children
}) => {
  return (
    <div className={classnames(styles.layout, className)}>
      <header>
        <h1>
          PINGPOD
        </h1>
      </header>

      <main className={styles.content}>
        {children}
      </main>
    </div>
  )
}

export default Layout