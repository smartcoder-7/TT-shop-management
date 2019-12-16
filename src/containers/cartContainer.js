import React from 'react'
import { Container, Subscribe, Provider } from 'unstated'

import parseSessionId from 'util/parseSessionId'
import getSessionRate from 'util/getSessionRate'

const ROOT_KEY = 'pingpod'
const CART_KEY = `${ROOT_KEY}/cart`
const LOCATION_KEY = `${ROOT_KEY}/locationId`
const PREMIUM_KEY = `${ROOT_KEY}/premium-sessions`

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
      sum += rate.MEMBER
    })

    return sum
  }

  get totalTime() {
    return this.items.length / 2
  }

  get locationId() {
    return localStorage.getItem(LOCATION_KEY) || ''
  }

  constructor() {
    super()

    let storedItems = []
    let premium = {}

    try {
      const cookie = localStorage.getItem(CART_KEY) || ''
      const storedString = cookie.trim()
      if (storedString) {
        storedItems = storedString.split(',')
      }
    } catch (err) {
      console.warn(err)
    }

    try {
      const cookie = localStorage.getItem(PREMIUM_KEY) || '{}'
      const storedString = cookie.trim()
      premium = JSON.parse(storedString)
    } catch (err) {
      console.warn(err)
    }

    this.state.items = storedItems
    this.state.premium = premium

    this.poll()
  }

  poll = () => {
    setInterval(this.clean, 3000)
  }

  clean = () => {
    const oldItems = this.items

    const newItems = oldItems.filter(sessionId => {
      const { time } = parseSessionId(sessionId)
      const isPast = time < Date.now()
      return !isPast
    })

    if (newItems.length === oldItems.length) return

    localStorage.setItem(CART_KEY, newItems.join(','))
    this.setState({ items: newItems })
  }

  empty = () => {
    this.setState({ items: [], premium: {} })
    localStorage.setItem(CART_KEY, '')
    localStorage.setItem(PREMIUM_KEY, '')
  }

  isInCart = (sessionId) => {
    return this.items.indexOf(sessionId) > -1
  }

  addItem = (item) => {
    const items = [...this.state.items]

    if (items.indexOf(item) > -1) {
      return
    }

    items.push(item)

    localStorage.setItem(CART_KEY, items.join(','))
    this.setState({ items })
  }

  removeItem = (item) => {
    const items = [...this.state.items]
    const index = items.indexOf(item)

    if (index < 0) {
      return
    }

    items.splice(index, 1)
    localStorage.setItem(CART_KEY, items.join(','))
    this.setState({ items })
  }

  togglePremium = (item, val) => {
    const premium = { ...this.state.premium }

    if (typeof val !== 'undefined') {
      if (premium[item] === val) return
      premium[item] = val
    } else {
      premium[item] = !premium[item]
    }
    localStorage.setItem(PREMIUM_KEY, JSON.stringify(premium))
    this.setState({ premium })
  }

  isPremium = item => {
    return !!this.state.premium[item]
  }

  setLocationId = (locationId) => {
    localStorage.setItem(LOCATION_KEY, locationId)
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
