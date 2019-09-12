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
    <path d="M2,25L100,25" />
    <path d="M20,10L2,25L20,40" />
  </svg>
)

export default ArrowLeft