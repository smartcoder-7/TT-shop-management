
import React from 'react'

import styles from './styles.scss'

const ThreeStar = ({ className }) => (
  <svg
    className={className}
    version="1.1"
    x="0px" y="0px"
    viewBox="0 10 31.6 11.6"
  >
    <polygon points="5.1,11.3 6.6,14.3 9.9,14.7 7.5,17.1 8.1,20.3 5.1,18.8 2.2,20.3 2.8,17.1 0.4,14.7 3.7,14.3 " />
    <polygon points="15.8,11.3 17.3,14.3 20.6,14.7 18.2,17.1 18.7,20.3 15.8,18.8 12.9,20.3 13.4,17.1 11.1,14.7 14.3,14.3 " />
    <polygon points="26.5,11.3 27.9,14.3 31.2,14.7 28.8,17.1 29.4,20.3 26.5,18.8 23.5,20.3 24.1,17.1 21.7,14.7 25,14.3 " />
  </svg>
)

export default ThreeStar
