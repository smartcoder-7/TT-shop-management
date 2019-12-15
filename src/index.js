import React from 'react'
import ReactDOM from 'react-dom'
import ScrollMemory from 'react-router-scroll-memory'
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom'

import authContainer, { AuthSubscriber } from './containers/authContainer'

import Home from 'pages/Home'
import PodSchedule from 'pages/PodSchedule'
import LocationPicker from 'pages/LocationPicker'
import Login from 'pages/Login'
import Cart from 'pages/Cart'
import Account from 'pages/Account'
import Checkout from 'pages/Checkout'
import Admin from 'pages/Admin'

import 'styles/index.scss'

const IS_OFFLINE = process.env.IS_OFFLINE === "true"

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

        if (
          IS_OFFLINE ||
          window.location.pathname === '/login' ||
          (authContainer.userId && authContainer.user)
        ) {
          return <Component {...props} />
        }

        return (
          <Redirect
            to={{
              pathname: "/login",
              search: `?redirect=${window.location.pathname}`,
            }}
          />
        )
      }}
    />
  )

const App = () => (
  <Router>
    <ScrollMemory />

    <AuthSubscriber>{() => (
      <>
        <Route path="/" exact component={Home} />

        <Switch>
          <Route path="/reserve" exact component={LocationPicker} />
          <Route path="/reserve/:locationId?" component={PodSchedule} />

          <Route path="/login" component={Login} />

          <AuthenticatedRoute path="/account" component={Account} />
          <AuthenticatedRoute path="/cart" component={Cart} />
          <AuthenticatedRoute path="/checkout" component={Checkout} />

          <AuthenticatedRoute path="/admin" component={Admin} />
        </Switch>
      </>
    )}</AuthSubscriber>
  </Router>
)

ReactDOM.render(<App />, document.getElementById('app'))
