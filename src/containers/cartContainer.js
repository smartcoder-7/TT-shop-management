import React from 'react'
import { Container, Subscribe, Provider } from 'unstated'

class CartContainer extends Container {
  state = {
    items: [],
  }

  constructor() {
    super()
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