import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route } from "react-router-dom"

import PodSchedule from 'pages/PodSchedule'

import './styles.scss'

class App extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Router>
        <Route path="/" exact component={PodSchedule} />
      </Router>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'))