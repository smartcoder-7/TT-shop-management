import React from 'react'
import ReactDOM from 'react-dom'
import ScrollMemory from 'react-router-scroll-memory'
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom'

import authContainer, { AuthSubscriber } from './containers/authContainer'

import Home from 'pages/Home'
import PodSchedule from 'pages/PodSchedule'
import LocationPicker from 'pages/LocationPicker'
import Login from 'pages/Login'
import SignUp from 'pages/SignUp'
import Cart from 'pages/Cart'
import Account from 'pages/Account'
import Success from 'pages/Success'
import Invite from 'pages/Invite'
import * as Admin from 'pages/Admin'

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
  const isAdmin = (authContainer.user && authContainer.user.isAdmin)

  return (
    <AuthenticatedRoute
      {...rest}
      component={isAdmin ? Component : RedirectRoute}
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
          <Route path="/sign-up" component={SignUp} />

          <AuthenticatedRoute path="/account" component={Account} />
          <AuthenticatedRoute path="/cart" component={Cart} />
          <AuthenticatedRoute path="/success/:orderId?" component={Success} />
          <AuthenticatedRoute path="/invite/:tokenId" component={Invite} />

          <AdminRoute path="/admin" exact component={Admin.Home} />
          <AdminRoute path="/admin/location/:locationId?" component={Admin.Location} />
          <AdminRoute path="/admin/users" component={Admin.Users} />
          <AdminRoute path="/admin/products" component={Admin.Products} />
        </Switch>
      </>
    )}</AuthSubscriber>
  </Router>
)

ReactDOM.render(<App />, document.getElementById('app'))
