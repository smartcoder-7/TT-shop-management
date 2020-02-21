import React, { useState, useEffect } from 'react'

import authContainer from 'containers/authContainer'
import Layout from 'components/Layout'
import { formatDate } from 'shared/datetime'
import { getReservations, searchInvites, getPurchases } from 'api'
import constants from 'shared/constants'
import Reservations from 'components/Reservations'
import UserActions from 'components/User/UserActions'
import UserBadges from 'components/User/UserBadges'
import { ActiveReservationRange } from 'components/Reservations/ReservationRange';

import styles from './styles.scss'

const UserReservations = ({ reservations, invites }) => {
  const [showPast, setShowPast] = useState(false)

  const sortedReservations = reservations
    .filter(r => !r.canceled)
    .sort((a, b) => {
      return a.reservationTime > b.reservationTime ? 1 : -1
    })

  const isActive = r => r.reservationTime >= Date.now() - constants.INTERVAL_MS
  const isPast = r => !isActive(r)

  const activeReservations = sortedReservations.filter(isActive)
  const pastReservations = sortedReservations.filter(isPast)
  const activeInvites = invites.filter(i => isActive(i.reservation))

  return (
    <div className={styles.userReservations}>
      <label className={styles.header}>Upcoming Reservations</label>
      <Reservations
        invites={activeInvites}
        reservations={activeReservations}
        reservationClass={styles.reservation}
        RangeComponent={ActiveReservationRange}
        showUnlock
      />

      {!activeReservations.length && !activeInvites.length && <p data-p3>No upcoming reservations.</p>}

      <br />

      {!!pastReservations.length && (
        <label className={styles.showPast} onClick={() => setShowPast(!showPast)}>
          {showPast ? '- Hide' : '+ Show'} Past Reservations
        </label>
      )}
      {showPast && <Reservations reservations={pastReservations} reverse />}
    </div>
  )
}

const Now = ({ }) => {
  const [userReservations, setUserReservations] = useState([])
  const [userInvites, setUserInvites] = useState([])
  const { user } = authContainer
  const userId = authContainer.userId

  useEffect(() => {
    getReservations({ userId: user.id, withInvites: true })
      .then(({ reservations }) => {
        setUserReservations(reservations)
      })
    searchInvites({
      rules: [
        ['invitedUser', '==', user.id]
      ]
    })
      .then((invites) => {
        setUserInvites(invites)
      })
  }, [user.id])

  return (
    <Layout className={styles.shop}>
      <div data-row>
        <div data-col="12" >
          <UserReservations reservations={userReservations} invites={userInvites} />
          <br />
        </div>
      </div>
    </Layout>
  )
}
export default Now
