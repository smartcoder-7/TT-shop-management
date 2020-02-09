import React, { useState, useRef, useEffect } from 'react'
import { withRouter, Link } from 'react-router-dom'
import classNames from 'classnames'
import locations from '../../../locations'

import { getAvailableSessions } from 'api'
import Layout from 'components/Layout'
import getSessionRate from 'util/getSessionRate'
import Loading from 'components/Loading'
import RateLabel from 'components/RateLabel'
import DayPicker from 'components/DayPicker'

import styles from './styles.scss'
import cartContainer, { CartSubscriber } from 'containers/cartContainer'

import TableRates from './TableRates'
import ThreeStar from 'components/svg/ThreeStar.js';
import TwoStar from 'components/svg/TwoStar';
import { getDayStartTime, formatTime } from 'shared/datetime'
import authContainer from 'containers/authContainer'

const FULL_DAY = (1000 * 60 * 60 * 24)
const POLL_INTERVAL = 1000 * 60 * 5

export const Session = ({
  session: {
    startTime,
    tablesLeft,
    bookedBy,
    regularTablesLeft,
    premiumTablesLeft,
  },
  locationId
}) => {
  const location = locations[locationId]
  const sessionId = `${locationId}/${startTime}`
  const premium = cartContainer.isPremium(sessionId)
  const isSelected = cartContainer.isInCart(sessionId)

  const rate = getSessionRate(sessionId)

  const alreadyBooked = bookedBy.indexOf(authContainer.userId) > -1

  useEffect(() => {
    if (!regularTablesLeft) cartContainer.togglePremium(sessionId, true)
    else if (!premiumTablesLeft) cartContainer.togglePremium(sessionId, false)
  }, [regularTablesLeft, premiumTablesLeft, premium])

  const onClick = () => {
    if (alreadyBooked) return
    if (isSelected) cartContainer.removeItem(sessionId)
    else cartContainer.addItem(sessionId)
  }

  const togglePremium = (e) => {
    if (!regularTablesLeft || !premiumTablesLeft) return

    e.stopPropagation()
    cartContainer.togglePremium(sessionId)
  }

  return (
    <div
      data-selected={isSelected}
      data-booked={alreadyBooked}
      data-premium={premium}
      className={classNames(styles.session, styles.scheduleSession)}
      onClick={onClick}
    >
      <div className={styles.sessionInfo}>
        <div className={styles.check}>✔</div>
        <label>{formatTime(startTime, location.timezone)}</label>
        {alreadyBooked && <RateLabel rate={{ displayName: 'Booked by you ✔' }} />}
        <RateLabel rate={rate} />
        {premium && <span className={styles.premiumLabel}>
          <RateLabel rate={{ displayName: 'Premium' }} />
        </span>}
      </div>
      {!alreadyBooked && <div className={styles.premiumWrapper} onClick={togglePremium}>
        <div className={styles.premium}>
          {!!regularTablesLeft && <TwoStar className={styles.regularSvg} />}
          {!!premiumTablesLeft && <ThreeStar className={styles.premiumSvg} />}
        </div>
      </div>}
    </div>
  )
}

const SessionPicker = ({ locationId, startTime, endTime }) => {
  const [loading, setLoading] = useState(true)
  const [sessions, setSessions] = useState([])

  const canCheckout = !!cartContainer.items.length

  useEffect(() => {
    const updateSessions = () => {
      const requestedStartTime = startTime

      setLoading(true)
      getAvailableSessions({ locationId, startTime, endTime })
        .then(({ sessions }) => {
          setLoading(false)

          // No race conditions
          if (requestedStartTime !== startTime) return

          const filteredSessions = sessions.filter(({ startTime }) => {
            return startTime >= Date.now()
          })

          setSessions(filteredSessions)
        })
    }

    // const poll = setInterval(updateSessions, POLL_INTERVAL)
    updateSessions()

    return () => {
      // clearInterval(poll)
    }
  }, [locationId, startTime, endTime])

  return (
    <>
      <div className={styles.sessions} data-is-active={canCheckout}>
        {loading && <Loading />}
        {!loading && sessions.map(session => {
          const alreadyBooked = session.bookedBy.indexOf(authContainer.userId) > -1
          if (!session.tablesLeft && !alreadyBooked) return null
          if (!session.hasAccess) return null
          return <Session
            session={session}
            locationId={locationId}
            key={session.startTime}
          />
        })}
      </div>

      <Link to="/cart" data-col="12">
        <div className={styles.checkout} data-is-active={canCheckout}>
          <label>Reserve</label>
          <div className={styles.total}>
            ${cartContainer.totalPrice} / {cartContainer.totalTime} hr
          </div>
        </div>
      </Link>
    </>
  )
}

const PodSchedule = ({ match: { params } }) => {
  const locationId = params.locationId
  const location = locations[locationId]

  const initialStart = getDayStartTime(Date.now(), location.timezone)
  const [startTime, setStartTime] = useState(initialStart)
  const endTime = startTime + FULL_DAY

  return (
    <Layout className={styles.podSchedule}>
      <div className={styles.header}>
        <div className={styles.info}>
          <h3 className={styles.location}>
            {location.displayName}.
            <TableRates location={location} />
          </h3>
        </div>

        <DayPicker timezone={location.timezone} onChange={time => setStartTime(time)} />
      </div>

      <CartSubscriber>{() => (
        <SessionPicker
          locationId={locationId}
          startTime={startTime}
          endTime={endTime}
        />
      )}</CartSubscriber>
    </Layout>
  )
}

export default withRouter(PodSchedule)
