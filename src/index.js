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
import Success from 'pages/Success'
import Admin from 'pages/Admin'

import 'styles/index.scss'

const RedirectRoute = ({ location }) => (
  <Redirect
    to={{
      pathname: "/login",
      search: `?redirect=${location.pathname}`,
    }}
  />
)

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

        return <RedirectRoute {...props} />
      }}
    />
  )

const AdminRoute = ({
  component: Component,
  ...rest
}) => {
  const isAdmin = (!authContainer.user || !authContainer.user.isAdmin)

  return (
    <AuthenticatedRoute
      {...rest}
      component={isAdmin ? Component : Redirect}
    />
  )
}

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
          <AuthenticatedRoute path="/success/:orderId?" component={Success} />

          <AdminRoute path="/admin" component={Admin} />
        </Switch>
      </>
    )}</AuthSubscriber>
  </Router>
)

ReactDOM.render(<App />, document.getElementById('app'))
