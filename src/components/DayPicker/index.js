import React, { useState, useRef, useEffect } from 'react'
import { getDayStartTime, parseTime } from 'shared/datetime'

import styles from './styles.scss'

const FULL_DAY = (1000 * 60 * 60 * 24)

const addDays = (time, days) => {
  return time + (days * FULL_DAY)
}

const DayPicker = ({ onChange, initialDay, timezone, className = '' }) => {
  const getToday = () => getDayStartTime(Date.now(), timezone)
  const _today = initialDay || getToday()
  console.log(_today, typeof _today)
  const [today, setToday] = useState(_today)
  const [activeDay, setActiveDay] = useState(today)

  useEffect(() => {
    const newToday = getToday()
    if (newToday === today) return

    setToday(newToday)
  }, [activeDay, today])

  const upcomingDays = new Array(30).fill('').map((_, i) => i)

  const changeDay = (time) => {
    onChange(time)
    setActiveDay(time)
  }

  return (
    <div className={`${styles.dayPicker} ${className}`}>
      {upcomingDays.map(n => {
        const time = addDays(today, n)
        const { dayOfTheWeekAbbr, monthAbbr, day } = parseTime(time, timezone)
        return (
          <div
            className={styles.day}
            key={time}
            onClick={() => changeDay(time)}
            data-is-active={time === activeDay}
          >
            <span>{time === today ? 'Today' : dayOfTheWeekAbbr}</span>
            <label>{monthAbbr} {day}</label>
          </div>
        )
      })}
    </div>
  )
}

export default DayPicker
