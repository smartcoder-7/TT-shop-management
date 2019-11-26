import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom'

import authContainer, { AuthSubscriber } from './containers/authContainer'

import Home from 'pages/Home'
import PodSchedule from 'pages/PodSchedule'
import LocationPicker from 'pages/LocationPicker'
import Login from 'pages/Login'
import Cart from 'pages/Cart'
import Account from 'pages/Account'
import Checkout from 'pages/Checkout'
import firebase from 'util/firebase'

import 'styles/index.scss'

const AuthenticatedRoute = ({
  component: Component,
  path,
  ...rest
}) => (
    <Route
      {...rest}
      render={props => {
        if (authContainer.state.loading) {
          return null
        }

        if (authContainer.userId && authContainer.user) {
          return <Component {...props} />
        }

        return (
          <Redirect
            to={{
              pathname: "/login",
              search: `?redirect=${window.location}`,
            }}
          />
        )
      }}
    />
  )

const App = () => (
  <Router>
    <AuthSubscriber>{() => (
      <>
        <Route path="/" exact component={Home} />
        <Route path="/reserve" exact component={LocationPicker} />
        <Route path="/reserve/:locationId?" component={PodSchedule} />
        <Route path="/login" component={Login} />

        <Switch>
          <AuthenticatedRoute path="/account" component={Account} />
          <AuthenticatedRoute path="/cart" component={Cart} />
          <AuthenticatedRoute path="/checkout" component={Checkout} />
        </Switch>
      </>
    )}</AuthSubscriber>
  </Router>
)

ReactDOM.render(<App />, document.getElementById('app'))