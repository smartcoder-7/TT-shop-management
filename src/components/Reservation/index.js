import React, { useState, useEffect } from 'react'

import styles from './styles.scss'
import { AccountSession } from '../../components/Session'
import RequestAccess from './RequestAccess'

const Reservation = ({ docRef }) => {
  const [doc, setDoc] = useState()

  useEffect(() => {
    docRef.get().then(setDoc)
  }, [])

  if (!doc || !doc.exists) return null

  const { date, time, locationId } = doc.data()
  return (
    <>
      <AccountSession
        id={`${locationId}-${time}`}
      />

      <RequestAccess />
    </>
  )
}

export default Reservation