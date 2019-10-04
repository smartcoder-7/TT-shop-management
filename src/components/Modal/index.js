import React from 'react'

import styles from './styles.scss'

const Modal = ({ children, isActive, onClose = () => {} }) => {
  return (
    <>
      <div className={styles.modal} data-active={isActive} onClick={onClose}>
        <div className={styles.modalContent} data-row onClick={(e) => e.stopPropagation()}>
          <div data-col="12">
            {children}
          </div>

          <div className={styles.close} onClick={onClose}>✕</div>
        </div>
      </div>
    </>
  )
}

export default Modal