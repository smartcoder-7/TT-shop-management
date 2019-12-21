import React from 'react'

import styles from './styles.scss'
import modalContainer from 'containers/modalContainer';

const Modal = ({ children, isActive }) => {
  const onClose = () => modalContainer.close()

  return (
    <>
      <div className={styles.modal} data-active={isActive}>
        <div className={styles.background} data-modal-bg-color onClick={onClose} />
        <div className={styles.modalContent} data-row>
          <div data-modal-bg-color className={styles.modalInner} data-col="12">
            {children}
            <div className={styles.close} onClick={onClose}>✕</div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Modal
