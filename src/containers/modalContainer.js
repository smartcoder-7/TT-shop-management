import React from 'react'
import { Container, Subscribe, Provider } from 'unstated'

const NOOP = () => { }

class ModalContainer extends Container {
  state = {
    content: null,
    isOpen: false,
    onClose: NOOP,
    fullScreen: false
  }

  get content() { return this.state.content }
  get isOpen() { return this.state.isOpen }
  get fullScreen() { return this.state.fullScreen }

  constructor() {
    super()
  }

  open = ({ content, fullScreen, onClose = NOOP }) => {
    this.close()
    this.setState({ isOpen: true, fullScreen, content, onClose })
  }

  setContent = ({ content }) => {
    if (content === this.state.content) return
    this.setState({ content })
  }

  close = () => {
    this.state.onClose()
    this.setState({
      isOpen: false,
      content: null,
      fullScreen: false,
      onClose: NOOP
    })
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