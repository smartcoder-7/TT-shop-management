import React, { useState, useRef, useEffect } from 'react'
import { withRouter, Link } from 'react-router-dom'
import classNames from 'classnames'
import locations from '../../../locations.json'

import { getAvailableSessions } from 'api'
import parseSessionId from 'util/parseSessionId'
import Layout from 'components/Layout'
import { getDateParts } from 'util/datetime'

import styles from './styles.scss'
import cartContainer, { CartSubscriber } from 'containers/cartContainer'
import ArrowLeft from 'components/svg/ArrowLeft'
import ArrowRight from 'components/svg/ArrowRight'

import TableRates from './TableRates'

const FULL_DAY = (1000 * 60 * 60 * 24)

const flattenTime = (time) => {
  const newDate = new Date(time)
  newDate.setHours(0)
  newDate.setMinutes(0)
  newDate.setSeconds(0)
  newDate.setMilliseconds(0)
  return newDate.getTime()
}

const getDifferentDate = (original, diff) => {
  const newDate = new Date(original)
  newDate.setHours(0)
  newDate.setMinutes(0)
  newDate.setSeconds(0)
  newDate.setMilliseconds(0)
  newDate.setDate(original.getDate() + diff)

  if (newDate.getTime() < Date.now()) return new Date()
  return newDate
}

const addDays = (time, days) => {
  return flattenTime(time) + (days * FULL_DAY)
}

const add24Hours = time => {
  return flattenTime(time) + FULL_DAY
}

const getToday = () => flattenTime(Date.now())

export const Session = ({
  sessionId
}) => {
  const isSelected = cartContainer.isInCart(sessionId)
  const { formattedTime, formattedEndTime } = parseSessionId(sessionId)

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
        {/* <RateLabel rate={rate} /> */}
      </div>
      <div className={styles.check}>✔</div>
    </div>
  )
}

// Every 5 minutes.
const POLL_INTERVAL = 1000 * 60 * 5

const PodSchedule = ({ match: { params } }) => {
  const [today, setToday] = useState(getToday())
  const [activeDay, setActiveDay] = useState(today)
  const [sessions, setSessions] = useState([])
  const sessionsRef = useRef()

  const locationId = params.locationId
  const location = locations[locationId]

  useEffect(() => {
    const newToday = getToday()
    if (newToday !== today) {
      setToday(newToday)
      return
    }

    const startTime = activeDay
    const endTime = add24Hours(activeDay)

    const updateSessions = () => {
      getAvailableSessions({ locationId, startTime, endTime })
        .then(({ sessions }) => {
          if (startTime !== activeDay) return

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
  }, [activeDay, locationId, today])

  const upcomingDays = new Array(30).fill('').map((_, i) => i)
  console.log(upcomingDays)

  console.log('moop', sessions)

  const activeDate = getDateParts(new Date(activeDay))

  return (
    <Layout className={styles.podSchedule}>
      <div className={styles.header}>
        <div className={styles.info}>
          <h3 className={styles.location}>{location.displayName}.</h3>
        </div>

        <div className={styles.dayPicker}>
          {upcomingDays.map(n => {
            const time = addDays(today, n)
            const { dayOfTheWeekAbbr, monthAbbr, day } = getDateParts(new Date(time))
            // const upcomingDate = getDifferentDate(n)
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

      <CartSubscriber>{() => {
        const canCheckout = !!cartContainer.items.length

        return (
          <>
            <div className={styles.sessions} ref={sessionsRef} data-is-active={canCheckout}>
              {sessions.map(session => {
                const sessionId = `${locationId}-${session}`
                return <Session sessionId={sessionId} key={sessionId} />
              })}
            </div>

            <div className={styles.checkout} data-is-active={canCheckout}>
              <Link to="/cart" data-col="12">
                <button disabled={!cartContainer.items.length}>
                  Reserve Selected Times ({cartContainer.items.length})
                </button>
              </Link>

              <TableRates />
            </div>
          </>
        )
      }}</CartSubscriber>
    </Layout>
  )
}

export default withRouter(PodSchedule)