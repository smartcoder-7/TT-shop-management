import React, { useState } from 'react'
import { Form } from 'react-final-form'

import TextField from 'components/fields/TextField'
import Logo from 'components/Logo'
import styles from './styles.scss'
import authContainer from 'containers/authContainer'
import modalContainer from 'containers/modalContainer'
import ProductPicker from '../ProductPicker';


const OpenStore = ({ userId, children }) => {
  const ModalContent = () => {
    return (
      <div data-row className={styles.openStore}>
        <div data-col="12" >
          <div className={styles.header}>
            <Logo className={styles.logo} />
            <span data-label>Shop</span>
          </div>

          <ProductPicker onPurchase={() => modalContainer.close()} userId={userId} />
        </div>
      </div>
    )
  }

  const openModal = () => {
    modalContainer.open({
      fullScreen: true,
      content: <ModalContent />
    })
  }

  return children({ open: () => openModal() })
}

export default OpenStore

