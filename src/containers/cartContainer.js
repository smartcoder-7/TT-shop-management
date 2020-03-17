import React from 'react'
import { Container, Subscribe, Provider } from 'unstated'

import * as storage from 'util/localStorage'
import parseSessionId from 'shared/parseSessionId'
import getSessionRate from 'util/getSessionRate'
import authContainer from './authContainer'
import { MIN_RESERVATION_TIME } from 'shared/constants'

const {
  CART_KEY,
  LOCATION_KEY,
} = storage

class CartContainer extends Container {
  state = {
    items: [],
  }

  get items() {
    return this.state.items || []
  }

  get totalPrice() {
    let sum = 0

    this.items.forEach(sessionId => {
      const rate = getSessionRate(sessionId)
      const price = rate.for(authContainer.user)
      sum += (price / 2)
    })

    return sum
  }

  get cartKey() {
    return `${CART_KEY}/${this.locationId}`
  }

  get summary() {
    let time
    if (this.totalTime === 0) return 'No sessions selected.'
    else if (this.totalTime < 1) time = `${parseInt(this.totalTime * 60)} min`
    else if (this.totalTime === 1) time = '1 hr'
    else time = `${this.totalTime} hrs`

    const price = this.totalPrice ? `$${this.totalPrice}` : 'Free'
    return `${time} (${price})`
  }

  get totalTime() {
    return this.items.length / 2
  }

  get locationId() {
    return storage.getString(LOCATION_KEY)
  }

  constructor() {
    super()

    this.clean(false)
    this.state.items = storage.getArray(this.cartKey)

    this.poll()
  }

  poll = () => {
    setInterval(this.clean, 3000)
  }

  clean = (rerender = true) => {
    const oldItems = storage.getArray(this.cartKey)

    const newItems = oldItems.filter(sessionId => {
      try {
        const { time, locationId } = parseSessionId(sessionId)
        const isPast = time < Date.now() - MIN_RESERVATION_TIME
        return !isPast
      } catch (err) {
        console.warn('Malformed cart item:', sessionId)
        return false
      }
    })

    if (newItems.length === oldItems.length) return

    storage.setArray(this.cartKey, newItems)

    if (rerender) this.setState({ items: newItems })
  }

  empty = () => {
    this.setState({ items: [] })
    storage.clear(this.cartKey)
  }

  isInCart = (sessionId) => {
    return this.items.indexOf(sessionId) > -1
  }

  addItem = (item) => {
    const items = storage.addToArray(this.cartKey, item)
    if (items) this.setState({ items })
  }

  removeItem = (item) => {
    const items = storage.removeFromArray(this.cartKey, item)
    if (items) this.setState({ items })
  }

  setLocationId = (locationId) => {
    storage.setString(LOCATION_KEY, locationId)
    const items = storage.getArray(this.cartKey)
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
