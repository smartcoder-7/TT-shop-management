import React from 'react'
import classNames from 'classnames'

import styles from './styles.scss'

const ArrowLeft = ({ className, theme = 'default' }) => (
  <svg 
    className={classNames(styles.arrowLeft, className)} 
    data-theme={theme}
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 100 50"
  >
    <path d="M0,25L98,25" />
    <path d="M80,10L98,25L80,40" />
  </svg>
)

export default ArrowLeft