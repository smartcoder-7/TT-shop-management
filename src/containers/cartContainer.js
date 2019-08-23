import React from 'react'
import { Container, Subscribe, Provider } from 'unstated'

import { parseSession } from 'util/getPodSessions'

const ROOT_KEY = 'pingpod'
const CART_KEY = `${ROOT_KEY}/cart`

class CartContainer extends Container {
  state = {
    items: {},
    watchedPods: []
  }

  get items() {
    return this.state.items
  }

  get locationIds() {
    return Object.keys(this.items || {})
  }

  constructor() {
    super()

    let storedItems = {}
    
    try {
      storedItems = JSON.parse(localStorage.getItem(CART_KEY))
    } catch (err) {
      console.log(err)
    }

    this.state.items = storedItems
  }


  getDates = () => {
    const locationIds = this.locationIds
    const dates = []

    locationIds.forEach(locationId => {
      const dateIds = Object.keys(this.items[locationId] || {})

      dateIds.forEach(date => {
        dates.push({
          date,
          locationId,
          times: this.items[locationId][date]
        })
      })
    })

    return dates
  }

  addItem = (item) => {
    const {
      locationId,
      year,
      month,
      day,
      time
    } = parseSession(item)

    const date = `${year}-${month}-${day}`

    const items = { ...this.state.items }
    items[locationId] = items[locationId] || {}
    items[locationId][date] = items[locationId][date] || []

    if (items[locationId][date].indexOf(time) > -1) {
      return
    }

    items[locationId][date].push(time)

    localStorage.setItem(CART_KEY, JSON.stringify(items))
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