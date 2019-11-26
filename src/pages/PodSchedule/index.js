import React, { useState, useRef, useEffect } from 'react'
import { withRouter, Link } from 'react-router-dom'
import classNames from 'classnames'

import { getAvailableSessions } from 'api'
import parseSessionId from 'util/parseSessionId'
import Layout from 'components/Layout'
import getDateParts from 'util/getDateParts'

import styles from './styles.scss'
import cartContainer, { CartSubscriber } from 'containers/cartContainer'
import ArrowLeft from 'components/svg/ArrowLeft'
import ArrowRight from 'components/svg/ArrowRight'

import TableRates from './TableRates'

const getDifferentDate = (original, diff) => {
  const newDate = new Date(original)
  newDate.setHours(0)
  newDate.setMinutes(0)
  newDate.setSeconds(0)
  newDate.setMilliseconds(0)
  newDate.setDate(original.getDate() + diff)
  return newDate
}

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

const PodSchedule = ({ match: { params } }) => {
  const [start, setStart] = useState(new Date())
  const [sessions, setSessions] = useState([])
  const sessionsRef = useRef()

  const locationId = params.locationId

  const adjustDate = (diff) => {
    const newStart = getDifferentDate(start, diff)
    setStart(newStart)
  }

  const prevDay = () => { adjustDate(-1) }
  const nextDay = () => { adjustDate(1) }

  const {
    dayOfTheWeek,
    month,
    day
  } = getDateParts(start)

  useEffect(() => {
    const end = getDifferentDate(start, 1)
    const startTime = start.getTime()
    const endTime = end.getTime()

    getAvailableSessions({ locationId, startTime, endTime })
      .then(({ sessions }) => {
        if (startTime !== start.getTime()) return
        setSessions(sessions)
      })
  }, [start, locationId])

  console.log('moop', sessions)

  return (
    <Layout className={styles.podSchedule}>
      <div data-row>
        <div data-col="2" className={styles.prevDay} onClick={prevDay}>
          <ArrowLeft />
        </div>
        <div data-col="8" className={styles.today}>
          <p data-label>{dayOfTheWeek}</p>
          <h1>{month} {day}</h1>
        </div>
        <div data-col="2" className={styles.nextDay} onClick={nextDay}>
          <ArrowRight />
        </div>
      </div>

      <CartSubscriber>{() => (
        <>
          <div className={styles.sessions} ref={sessionsRef}>
            {sessions.map(session => {
              const sessionId = `${locationId}-${session}`
              return <Session sessionId={sessionId} key={sessionId} />
            })}
          </div>

          {cartContainer.items && (
            <div className={styles.checkout}>
              <Link to="/cart" data-col="12">
                <button disabled={!cartContainer.items.length}>
                  Reserve Selected Times ({cartContainer.items.length})
                </button>
              </Link>

              <TableRates />
            </div>
          )}
        </>
      )}</CartSubscriber>
    </Layout>
  )
}

export default withRouter(PodSchedule)