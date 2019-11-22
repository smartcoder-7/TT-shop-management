import React, { useState, useEffect } from 'react'

import styles from './styles.scss'
import { AccountSession } from 'components/Session'
import Modal from 'components/Modal'
import { formatTime } from 'util/getPodSessions'
import { getAccessCode, getPod, getUser } from 'util/db'

// const Reservation = ({ docRef }) => {
//   const [doc, setDoc] = useState()
//   const [showModal, setShowModal] = useState(false)

//   useEffect(() => {
//     docRef.get().then(setDoc)
//   }, [])

//   if (!doc || !doc.exists) return null

//   const { date, time, locationId, payment } = doc.data()

//   return (
//     <>
//       <div onClick={() => setShowModal(true)}>
//         <AccountSession
//           id={`${locationId}-${time}`}
//         />
//       </div>
      
//       <Modal isActive={showModal} onClose={() => setShowModal(false)}>
//         <RequestAccess id={`${locationId}-${time}`} />
//       </Modal>
//     </>
//   )
// }

export const ReservationRange = ({ start, end, tables }) => {
  const docRef = tables[0].reservations[0]
  const [doc, setDoc] = useState()
  const [error, setError] = useState()
  const [showModal, setShowModal] = useState(false)
  const [accessCode, setAccessCode] = useState()

  useEffect(() => {
    docRef.get().then(setDoc)
  }, [])

  if (!doc || !doc.exists) return null

  const { date, time, locationId, payment } = doc.data()

  console.log(doc.data(), payment)

  const requestAccess = () => {
    const sessionId = `${locationId}-${time}`
    return getAccessCode(sessionId)
    .then((access) => {
      if (!access) {
        throw 'Not authenticated to access this session.'
      }

      setAccessCode(access.code)
    })
  } 

  const onClick = () => {
    requestAccess()
    .then(() => {
      setShowModal(true)
    })
    .catch(setError)
  }

  return (
    <>
      <div className={styles.reservation} onClick={onClick}>
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

        {payment && (
          <div className={styles.paymentDetails}>
            [PAID] 
            <br />
            <label>Payment Id: {payment.id}</label>
          </div>
        )}

        {error && <div>{error}</div>}
      </div>
      
      <Modal isActive={showModal} onClose={() => setShowModal(false)}>
        <div data-row>
          <div data-col="1"/>
          <div data-col="10">
            <h1>You're booked!</h1>
            <h4>{formatTime(start)} - {formatTime(end)}</h4>
            <br />
            Access Code: {accessCode}
          </div>
          <div data-col="1"/>
        </div>
        {/* <RequestAccess
          start={start}
          end={end}
          reservation={doc.data()}
        /> */}
      </Modal>
    </>
  )
}

// export default Reservation