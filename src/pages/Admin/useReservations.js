import React, { useState, useEffect, useContext } from 'react'
import { getReservations } from 'api'

const POLL_INTERVAL = 10000

const ReservationsContext = React.createContext({
  reservations: [],
  reservationsById: {},
  updateReservations: () => { }
});

export class ReservationsProvider extends React.Component {
  state = {
    updating: false,
    queued: false,
    reservations: []
  }

  componentWillMount() {
    this.updateReservations()
    const poll = () => this.updateReservations(false)
    this.interval = setInterval(poll, POLL_INTERVAL)
  }

  componentWillUnmount() {
    this.umounted = true
    clearInterval(this.interval)
  }

  updateReservations = (queue = true) => {
    if (this.unmounted) return
    if (this.updating) {
      if (queue) this.setState({ queued: true })
      return
    }

    this.setState({ updating: true })

    return getReservations({ starTime: this.props.startTime })
      .then(({ reservations }) => {
        if (this.unmounted) return
        this.setState({ updating: false, reservations })
        if (this.state.queued) {
          this.setState({ queued: false })
          this.updateReservations(false)
        }
        return reservations
      })
  }

  render() {
    const { reservations } = this.state

    const reservationsById = {}
    reservations.forEach(reservation => {
      reservationsById[reservation.id] = reservation
    })

    return (
      <ReservationsContext.Provider value={{ updateReservations: this.updateReservations, reservations, reservationsById }}>
        {this.props.children}
      </ReservationsContext.Provider>
    )
  }
}

const useReservations = () => useContext(ReservationsContext);

export default useReservations