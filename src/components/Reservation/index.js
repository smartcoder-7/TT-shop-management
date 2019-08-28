import React, { useState, useEffect } from 'react'

import styles from './styles.scss'
import { AccountSession } from 'components/Session'
import Modal from 'components/Modal'
import RequestAccess from './RequestAccess'
import { formatTime } from 'util/getPodSessions'

const Reservation = ({ docRef }) => {
  const [doc, setDoc] = useState()
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    docRef.get().then(setDoc)
  }, [])

  if (!doc || !doc.exists) return null

  const { date, time, locationId } = doc.data()
  return (
    <>
      <div onClick={() => setShowModal(true)}>
        <AccountSession
          id={`${locationId}-${time}`}
        />
      </div>
      
      <Modal isActive={showModal} onClose={() => setShowModal(false)}>
        <RequestAccess id={`${locationId}-${time}`} />
      </Modal>
    </>
  )
}

export const ReservationRange = ({ start, end, tables }) => {
  const docRef = tables[0].reservations[0]
  const [doc, setDoc] = useState()
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    docRef.get().then(setDoc)
  }, [])

  if (!doc || !doc.exists) return null

  const { date, time, locationId } = doc.data()

  return (
    <>
      <div className={styles.reservation} onClick={() => setShowModal(true)}>
        <button data-link>Get Access Code</button>
        <br />
        <p>{formatTime(start)} - {formatTime(end)}</p>

        <div className={styles.tableDetails}>
          {tables.map(({ time, reservations }) => (
            <div key={time}>
              {formatTime(time)}: {reservations.length} Tables
            </div>
          ))}
        </div>
      </div>
      
      <Modal isActive={showModal} onClose={() => setShowModal(false)}>
        <RequestAccess
          start={start}
          end={end}
          reservation={doc.data()}
        />
      </Modal>
    </>
  )
}

export default Reservation