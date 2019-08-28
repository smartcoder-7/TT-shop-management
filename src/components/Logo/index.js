import React from 'react'
import classNames from 'classnames'

import styles from './styles.scss'

const Logo = ({ className, theme = 'default' }) => (
  <svg 
    className={classNames(styles.logo, className)} 
    data-theme={theme}
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 800 220"
  >
    <title>Ping Pod Logo</title>
    
    <g className={styles.accent}>
      <polygon points="537 0 537 94 167 94 167 208 435.62 208 701.18 0 537 0"/>
      <circle cx="28.13" cy="28.13" r="28.13"/>
    </g>

    <g>
      <path d="M1069,296V408.5h0L946,504h217.16l122.92-95.5h217.2V296Zm405.53,83.72H1096.44V323.47H1474.5Z" transform="translate(-946 -296)"/>
    </g>
  </svg>
)

export default Logo