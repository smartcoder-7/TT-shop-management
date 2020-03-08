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

  const updateReservations = () => {
    searchReservations({
      rules: [
        ['reservationTime', '>=', startTime],
        ['reservationTime', '<', endTime],
        ['locationId', '==', locationId]
      ]
    })
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