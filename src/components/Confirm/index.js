import ReactDOM from 'react-dom'
import React, { useState, useEffect } from 'react'
import styles from './styles.scss'

const Confirm = ({ onConfirm, children }) => {
  const [showConfirm, setShowConfirm] = useState(false)

  const handleConfirm = () => {
    onConfirm()
    setShowConfirm(false)
  }

  const Test = () => (
    ReactDOM.createPortal((
      <div className={styles.confirm}>
        Confirm?
      <button onClick={handleConfirm} >Yes, continue</button>
      </div>
    ), document.getElementById('portals'))
  )

  const confirm = () => setShowConfirm(true)

  return (
    <>
      {showConfirm && <Test />}
      {children({ confirm })}
    </>
  )
}


export default Confirm
