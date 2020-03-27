import React, { useState, useEffect, useContext } from 'react'
import { searchReservations } from 'api'

const POLL_INTERVAL = 10000

const ReservationsContext = React.createContext({
  reservations: [],
  reservationsById: {},
  updateReservations: () => { }
});

export const ReservationsProvider = ({ startTime, endTime, locationId, children }) => {
  const [reservations, setReservations] = useState([])

  const rules = []

  if (startTime) rules.push(['reservationTime', '>=', startTime])
  if (endTime) rules.push(['reservationTime', '<', endTime])
  if (locationId) rules.push(['locationId', '==', locationId])

  const updateReservations = () => {
    searchReservations({ rules })
      .then((reservations) => {
        setReservations(reservations)
      })
  }

  useEffect(() => {
    updateReservations()
  }, [startTime, endTime, locationId])

  const reservationsById = {}
  reservations.forEach(reservation => {
    reservationsById[reservation.id] = reservation
  })

  return (
    <ReservationsContext.Provider value={{ updateReservations, reservations, reservationsById }}>
      {children}
    </ReservationsContext.Provider>
  )
}

const useReservations = () => useContext(ReservationsContext);

export default useReservations