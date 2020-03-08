import React, { useState, useRef, useEffect } from 'react'
import moment from 'moment-timezone'
import { withRouter, Link } from 'react-router-dom'
import classNames from 'classnames'
import locations from '../../../locations'

import { getAvailableSessions } from 'api'
import Layout from 'components/Layout'
import getSessionRate from 'util/getSessionRate'
import Loading from 'components/Loading'
import RateLabel from 'components/RateLabel'
import DayPicker from 'components/DayPicker'
import useSessionRange from 'components/useSessionRange'

import styles from './styles.scss'
import cartContainer, { CartSubscriber } from 'containers/cartContainer'

import TableRates from './TableRates'
import { getDayStartTime, formatTime } from 'shared/datetime'
import authContainer from 'containers/authContainer'

const FULL_DAY = (1000 * 60 * 60 * 24)
const POLL_INTERVAL = 1000 * 60 * 5

export const Session = ({
  session: {
    startTime,
    tablesLeft,
    bookedBy,
  },
  isNextDay,
  locationId
}) => {
  const location = locations[locationId]
  const sessionId = `${locationId}/${startTime}`
  const isSelected = cartContainer.isInCart(sessionId)

  const rate = getSessionRate(sessionId)

  const alreadyBooked = bookedBy.indexOf(authContainer.userId) > -1

  useEffect(() => {
    cartContainer.setLocationId(locationId)
  }, [locationId])

  const onClick = () => {
    if (alreadyBooked) return
    if (isSelected) cartContainer.removeItem(sessionId)
    else cartContainer.addItem(sessionId)
  }

  return (
    <div
      data-selected={isSelected}
      data-booked={!tablesLeft || alreadyBooked}
      className={classNames(styles.session, styles.scheduleSession)}
      onClick={onClick}
    >
      <div className={styles.sessionInfo}>
        <div className={styles.check}>✔</div>
        <label>
          {formatTime(startTime, location.timezone)}
          <span className={styles.nextDay}>{isNextDay && '+1'}</span>
        </label>
        {alreadyBooked && <RateLabel rate={{ displayName: 'Booked by you ✔' }} />}
        <RateLabel rate={rate} />
        {!alreadyBooked && (
          <label className={styles.count}>
            {tablesLeft || 'No'} Open Table{(tablesLeft > 1 || !tablesLeft) ? 's' : ''}
          </label>
        )}
      </div>
    </div>
  )
}

const SessionPicker = ({ location, startTime, endTime }) => {
  const [loading, setLoading] = useState(true)
  const [sessions, setSessions] = useState([])
  const { id: locationId, timezone } = location

  const dayStart = moment(new Date(startTime)).tz(timezone)
  dayStart.hours(0)
  dayStart.minutes(0)

  const canCheckout = !!cartContainer.items.length

  useEffect(() => {
    const updateSessions = () => {
      const requestedStartTime = startTime

      setLoading(true)
      getAvailableSessions({ userId: authContainer.userId, locationId, startTime, endTime })
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
  }, [locationId, startTime, endTime, authContainer.userId])

  return (
    <>
      <div className={styles.sessions} data-is-active={canCheckout}>
        {loading && <Loading />}
        {!loading && sessions.map(session => {
          const sessionStart = moment(new Date(session.startTime)).tz(timezone)
          const isNextDay = sessionStart.date() > dayStart.date()
          // if (!session.hasAccess) return null
          return <Session
            session={session}
            isNextDay={isNextDay}
            locationId={locationId}
            key={session.startTime}
          />
        })}
      </div>

      <Link to="/cart" data-col="12">
        <div className={styles.checkout} data-is-active={canCheckout}>
          <label>Check Out</label>
          <div className={styles.total}>
            {cartContainer.summary}
          </div>
        </div>
      </Link>
    </>
  )
}

const PodSchedule = ({ match: { params } }) => {
  const locationId = params.locationId
  const location = locations[locationId]

  const { startTime, endTime, requestTime } = useSessionRange({ location })

  if (!startTime) return null

  return (
    <Layout className={styles.podSchedule}>
      <div className={styles.header}>
        <div className={styles.info}>
          <h3 className={styles.location}>
            {location.displayName}.
            <TableRates location={location} />
          </h3>
        </div>

        <DayPicker timezone={location.timezone} onChange={requestTime} />
      </div>

      <CartSubscriber>{() => (
        <SessionPicker
          location={location}
          startTime={startTime}
          endTime={endTime}
        />
      )}</CartSubscriber>
    </Layout>
  )
}

export default withRouter(PodSchedule)
