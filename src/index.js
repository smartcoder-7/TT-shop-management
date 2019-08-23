import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route } from 'react-router-dom'

import { AuthSubscriber } from './containers/authContainer'

import Home from 'pages/Home'
import PodSchedule from 'pages/PodSchedule'
import Login from 'pages/Login'
import Cart from 'pages/Cart'
import Checkout from 'pages/Checkout'

import './styles.scss'

class App extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Router>
        <AuthSubscriber>{() => (
          <>
            <Route path="/" exact component={Home} />
            <Route path="/reserve/:locationId?" component={PodSchedule} />
            <Route path="/login" component={Login} />
            <Route path="/cart" component={Cart} />
            <Route path="/checkout" component={Checkout} />
          </>
        )}</AuthSubscriber>
      </Router>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'))