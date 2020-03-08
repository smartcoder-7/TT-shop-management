import { useState, useEffect } from 'react'
import moment from 'moment-timezone'

const useSessionRange = ({ location }) => {
  const { openStart, openDuration } = location
  const [startTime, setStartTime] = useState()
  const [endTime, setEndTime] = useState()

  const requestTime = time => {
    const m = moment(new Date(time)).tz(location.timezone)
    m.hours(openStart.hours)
    m.minutes(openStart.minutes)
    m.seconds(0)
    m.milliseconds(0)

    const newStart = parseInt(m.format('x'))
    const newEnd = parseInt(
      m
        .add(openDuration.hours, 'hours')
        .add(openDuration.minutes, 'minutes')
        .format('x')
    )

    setStartTime(newStart)
    setEndTime(newEnd)
  }

  useEffect(() => {
    requestTime(Date.now())
  }, [])

  return { startTime, endTime, requestTime }
}

export default useSessionRange