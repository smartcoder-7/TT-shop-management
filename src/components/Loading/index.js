import React from 'react'

import styles from './styles.scss'

const Loading = ({
  loading
}) => {

  if (!loading) return null

  return (
    <div data-label className={styles.loading}>Loading...</div>
  )
}

export default Loading