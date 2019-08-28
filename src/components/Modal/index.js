import React from 'react'

import styles from './styles.scss'

const Modal = ({ children, isActive, onClose = () => {} }) => {
  return (
    <>
      <div className={styles.modal} data-active={isActive}>
        <div className={styles.modalContent} data-row>
          <div data-col="1" />
          <div data-col="12">
            {children}
          </div>
          <div data-col="1" />

          <div className={styles.close} onClick={onClose}>X</div>
        </div>
      </div>
    </>
  )
}

export default Modal