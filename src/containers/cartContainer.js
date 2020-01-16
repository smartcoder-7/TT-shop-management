import React from 'react'
import { Container, Subscribe, Provider } from 'unstated'

import * as storage from 'util/localStorage'
import parseSessionId from 'util/parseSessionId'
import getSessionRate from 'util/getSessionRate'

const {
  CART_KEY,
  LOCATION_KEY,
  PREMIUM_KEY
} = storage

class CartContainer extends Container {
  state = {
    items: [],
    premium: {}
  }

  get items() {
    return this.state.items || []
  }

  get totalPrice() {
    let sum = 0

    this.items.forEach(sessionId => {
      const rate = getSessionRate(sessionId)
      sum += (rate.MEMBER / 2)
    })

    return sum
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
    this.state.items = storage.getArray(CART_KEY)
    this.state.premium = storage.getObject(PREMIUM_KEY)

    this.poll()
  }

  poll = () => {
    setInterval(this.clean, 3000)
  }

  clean = (rerender = true) => {
    const oldItems = storage.getArray(CART_KEY)

    const newItems = oldItems.filter(sessionId => {
      try {
        const { time, locationId } = parseSessionId(sessionId)
        const isPast = time < Date.now()
        return !isPast
      } catch (err) {
        console.warn('Malformed cart item:', sessionId)
        return false
      }
    })

    if (newItems.length === oldItems.length) return

    storage.setArray(CART_KEY, newItems)

    if (rerender) this.setState({ items: newItems })
  }

  empty = () => {
    this.setState({ items: [], premium: {} })
    storage.clear(CART_KEY)
    storage.clear(PREMIUM_KEY)
  }

  isInCart = (sessionId) => {
    return this.items.indexOf(sessionId) > -1
  }

  addItem = (item) => {
    const items = storage.addToArray(CART_KEY, item)
    if (items) this.setState({ items })
  }

  removeItem = (item) => {
    const items = storage.removeFromArray(CART_KEY, item)
    if (items) this.setState({ items })
  }

  togglePremium = (item, val) => {
    const premium = storage.getObject(PREMIUM_KEY)
    const isPremium = typeof val !== 'undefined'
      ? val
      : !premium[item]

    const newPremium = storage.updateObject(PREMIUM_KEY, { [item]: isPremium })
    this.setState({ premium: newPremium })
  }

  isPremium = item => {
    return !!this.state.premium[item]
  }

  setLocationId = (locationId) => {
    storage.setString(LOCATION_KEY, locationId)
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
