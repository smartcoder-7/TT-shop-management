import React, { useState, useRef, useEffect } from 'react'
import { withRouter, Link } from 'react-router-dom'
import classNames from 'classnames'
import locations from '../../../locations.json'

import { getAvailableSessions } from 'api'
import parseSessionId from 'util/parseSessionId'
import Layout from 'components/Layout'
import getSessionRate from 'util/getSessionRate'
import { getDateParts } from 'util/datetime'
import Loading from 'components/Loading'
import RateLabel from 'components/RateLabel'

import styles from './styles.scss'
import cartContainer, { CartSubscriber } from 'containers/cartContainer'

import TableRates from './TableRates'

const FULL_DAY = (1000 * 60 * 60 * 24)
const POLL_INTERVAL = 1000 * 60 * 5

const flattenTime = (time) => {
  const newDate = new Date(time)
  newDate.setHours(0)
  newDate.setMinutes(0)
  newDate.setSeconds(0)
  newDate.setMilliseconds(0)
  return newDate.getTime()
}

const addDays = (time, days) => {
  return flattenTime(time) + (days * FULL_DAY)
}

const getToday = () => flattenTime(Date.now())

export const Session = ({
  sessionId
}) => {
  const isSelected = cartContainer.isInCart(sessionId)
  const { formattedTime } = parseSessionId(sessionId)

  const rate = getSessionRate(sessionId)

  const onClick = () => {
    if (isSelected) cartContainer.removeItem(sessionId)
    else cartContainer.addItem(sessionId)
  }

  return (
    <div
      data-selected={isSelected}
      className={classNames(styles.session, styles.scheduleSession)}
      onClick={onClick}
    >
      <div className={styles.sessionInfo}>
        <label>{formattedTime}</label>
        <RateLabel rate={rate} />
      </div>
      <div className={styles.check}>✔</div>
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

  console.log('moop', sessions)

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
  const [today, setToday] = useState(getToday())
  const [activeDay, setActiveDay] = useState(today)

  const locationId = params.locationId
  const location = locations[locationId]

  useEffect(() => {
    const newToday = getToday()
    if (newToday === today) return

    setToday(newToday)
  }, [activeDay, locationId, today])

  const upcomingDays = new Array(30).fill('').map((_, i) => i)

  return (
    <Layout className={styles.podSchedule}>
      <div className={styles.header}>
        <div className={styles.info}>
          <h3 className={styles.location}>
            {location.displayName}.
            <TableRates />
          </h3>
        </div>

        <div className={styles.dayPicker}>
          {upcomingDays.map(n => {
            const time = addDays(today, n)
            const { dayOfTheWeekAbbr, monthAbbr, day } = getDateParts(new Date(time))
            return (
              <div
                className={styles.day}
                key={time}
                onClick={() => setActiveDay(time)}
                data-is-active={time === activeDay}
              >
                <span>{time === today ? 'Today' : dayOfTheWeekAbbr}</span>
                <label>{monthAbbr} {day}</label>
              </div>
            )
          })}
        </div>
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