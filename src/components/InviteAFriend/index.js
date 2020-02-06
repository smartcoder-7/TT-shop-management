
import React, { useState, useEffect } from 'react'
import { Form, Field } from 'react-final-form'
import { createInvites } from 'api'
import modalContainer from 'containers/modalContainer';
import EmailField from 'components/fields/EmailField'

import styles from './styles.scss'
import authContainer from 'containers/authContainer';

const InviteModal = ({ reservations }) => {
  const [inviteUrl, setInviteUrl] = useState()

  useEffect(() => {
    createInvites({
      userId: authContainer.userId,
      reservations: reservations.map(r => r.id)
    }).then(({ inviteUrl: url }) => {
      setInviteUrl(url)
    })
  }, [])

  return (
    <div data-row className={styles.reservationDetails}>
      <div data-col="1" />
      <div data-col="10" >
        <p data-p3>Copy this link and send it to a friend. When they accept, they will be given door access during your reservation.</p>
        <br />
        <input type="text" defaultValue={inviteUrl} readOnly />
      </div>
      <div data-col="1" />
    </div>
  )
}

const InviteAFriend = ({ reservations, children }) => {
  const openModal = (e) => {
    e.preventDefault()
    modalContainer.open({
      content: <InviteModal reservations={reservations} />
    })
  }

  return (
    <>
      <div onClick={openModal} style={{ cursor: 'pointer' }}>
        {children}
      </div>
    </>
  )
}

export default InviteAFriend
