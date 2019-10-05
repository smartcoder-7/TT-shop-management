import React from 'react'
import { Container, Subscribe, Provider } from 'unstated'
import makeReservations, { validateReservations } from 'util/makeReservations'

import { parseSession } from 'util/getPodSessions'
import authContainer from './authContainer';

const ROOT_KEY = 'pingpod'
const CART_KEY = `${ROOT_KEY}/cart`

class CartContainer extends Container {
  state = {
    items: [],
  }

  get items() {
    return this.state.items || []
  }

  get locationIds() {
    const locations = []

    this.items.forEach(item => {
      const {
        locationId,
      } = parseSession(item)

      if (locations.indexOf(locationId) < 0) {
        locations.push(locationId)
      }
    })

    return locations
  }

  get sessions() {
    const sessions = {}

    this.items.forEach(item => {
      const {
        locationId,
        date,
        time
      } = parseSession(item)

      sessions[locationId] = sessions[locationId] || {}
      sessions[locationId][date] = sessions[locationId][date] || {}
      sessions[locationId][date][time] = [ 'in-cart' ]
    })

    return sessions
  }

  constructor() {
    super()

    let storedItems = []
    
    try {
      const storedString = localStorage.getItem(CART_KEY).trim()
      if (storedString) {
        storedItems = storedString.split(',')
      }
    } catch (err) {
      console.log(err)
    }

    this.state.items = storedItems

    validateReservations({ 
      sessionIds: this.state.items, 
      userId: authContainer.userId, 
      onUnavailable: this.removeItem 
    })
  }

  empty = () => {
    this.setState({ items: [] })
    localStorage.setItem(CART_KEY, '')
  }

  isInCart = (sessionId) => {
    return this.items.indexOf(sessionId) > -1
  }

  addItem = (item) => {
    const items = [ ...this.state.items ]

    if (items.indexOf(item) > -1) {
      return
    }

    items.push(item)

    localStorage.setItem(CART_KEY, items.join(','))
    this.setState({ items })
  }

  removeItem = (item) => {
    const items = [ ...this.state.items ]
    const index = items.indexOf(item)

    if (index < 0) {
      return
    }

    items.splice(index, 1)
    localStorage.setItem(CART_KEY, items.join(','))
    this.setState({ items })
  }
}

const cartContainer = new CartContainer()

export default cartContainer

export const CartSubscriber = ({ children }) => (
  <Provider>
    <Subscribe to={[cartContainer]}>
      {children}
    </Subscribe>
  </Provider>
)