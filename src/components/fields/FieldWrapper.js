import React from 'react'

import styles from './styles.scss'

const FieldWrapper = ({ isEmpty = false, label, children }) => {
  return (
    <div className={styles.inputWrapper}>
      {children}
      <label data-empty={isEmpty}>{label}</label>
    </div>
  )
}

export default FieldWrapper