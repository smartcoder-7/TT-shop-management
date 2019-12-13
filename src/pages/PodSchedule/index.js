import React, { useState, useRef, useEffect } from 'react'
import { withRouter, Link } from 'react-router-dom'
import classNames from 'classnames'
import locations from '../../../locations.json'

import { getAvailableSessions } from 'api'
import parseSessionId from 'util/parseSessionId'
import Layout from 'components/Layout'
import getSessionRate from 'util/getSessionRate'
import { toNearestHour } from 'util/datetime'
import Loading from 'components/Loading'
import RateLabel from 'components/RateLabel'
import DayPicker from 'components/DayPicker'

import styles from './styles.scss'
import cartContainer, { CartSubscriber } from 'containers/cartContainer'

import TableRates from './TableRates'
import Crown from '../../components/svg/Crown.js';

const FULL_DAY = (1000 * 60 * 60 * 24)
const POLL_INTERVAL = 1000 * 60 * 5

const addDays = (time, days) => {
  return toNearestHour(time) + (days * FULL_DAY)
}

export const Session = ({
  sessionId
}) => {
  const premium = cartContainer.isPremium(sessionId)
  const isSelected = cartContainer.isInCart(sessionId)
  const { formattedTime } = parseSessionId(sessionId)

  const rate = getSessionRate(sessionId)

  const onClick = () => {
    if (isSelected) cartContainer.removeItem(sessionId)
    else cartContainer.addItem(sessionId)
  }

  const togglePremium = (e) => {
    e.stopPropagation()
    cartContainer.togglePremium(sessionId)
  }

  return (
    <div
      data-selected={isSelected}
      data-premium={premium}
      className={classNames(styles.session, styles.scheduleSession)}
      onClick={onClick}
    >
      <div className={styles.sessionInfo}>
        <div className={styles.check}>✔</div>
        <label>{formattedTime}</label>
        <RateLabel rate={rate} />
        {premium && <span className={styles.premiumLabel}>
          <RateLabel rate={{ displayName: 'Premium' }} />
        </span>}
      </div>
      <div className={styles.premiumWrapper} onClick={togglePremium}>
        <div className={styles.premium}>
          <Crown />
        </div>
      </div>
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

          const filteredSessions = sessions.filter(s => {
            return s >= Date.now()
          })
          setSessions(filteredSessions)
        })
    }

    const poll = setInterval(updateSessions, POLL_INTERVAL)
    updateSessions()

    return () => {
      clearInterval(poll)
    }
  }, [locationId, startTime, endTime])

  return (
    <>
      <div className={styles.sessions} data-is-active={canCheckout}>
        {loading && <Loading />}
        {!loading && sessions.map(session => {
          const sessionId = `${locationId}-${session}`
          return <Session sessionId={sessionId} key={sessionId} />
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
  const [activeDay, setActiveDay] = useState(toNearestHour(Date.now()))

  const locationId = params.locationId
  const location = locations[locationId]

  return (
    <Layout className={styles.podSchedule}>
      <div className={styles.header}>
        <div className={styles.info}>
          <h3 className={styles.location}>
            {location.displayName}.
            <TableRates />
          </h3>
        </div>

        <DayPicker onChange={time => setActiveDay(time)} />
      </div>

      <CartSubscriber>{() => (
        <SessionPicker
          locationId={locationId}
          startTime={activeDay}
          endTime={addDays(activeDay, 1)}
        />
      )}</CartSubscriber>
    </Layout>
  )
}

export default withRouter(PodSchedule)