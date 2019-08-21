import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route } from 'react-router-dom'

import { AuthSubscriber } from './containers/authContainer'

import PodSchedule from 'pages/PodSchedule'
import Login from 'pages/Login'

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
            <Route path="/" exact component={PodSchedule} />
            <Route path="/login" component={Login} />
          </>
        )}</AuthSubscriber>
      </Router>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'))