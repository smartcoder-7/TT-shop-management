import React from 'react'
import { Container, Subscribe, Provider } from 'unstated'

const NOOP = () => { }

class ModalContainer extends Container {
  state = {
    content: null,
    isOpen: false,
    onClose: NOOP
  }

  get content() { return this.state.content }
  get isOpen() { return this.state.isOpen }

  constructor() {
    super()
  }

  open = ({ content, onClose = NOOP }) => {
    this.setState({ isOpen: true, content, onClose })
  }

  close = () => {
    this.state.onClose()
    this.setState({ isOpen: false, content: null, onClose: NOOP })
  }
}

const modalContainer = new ModalContainer()

export default modalContainer

export const ModalSubscriber = ({ children }) => (
  <Provider>
    <Subscribe to={[modalContainer]}>
      {children}
    </Subscribe>
  </Provider>
)