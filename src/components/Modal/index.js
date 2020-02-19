import React from 'react'

import styles from './styles.scss'
import modalContainer from 'containers/modalContainer';

const Modal = ({ children, isActive, fullScreen }) => {
  const onClose = () => modalContainer.close()

  return (
    <>
      <div className={styles.modal} data-active={isActive} data-fullscreen={fullScreen}>
        <div className={styles.background} data-modal-bg-color onClick={onClose} />
        <div className={styles.modalContent} data-row>
          <div data-modal-bg-color className={styles.modalInner} >
            {children}
            <div className={styles.close} onClick={onClose}>✕</div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Modal
