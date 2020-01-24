import React from 'react'
import { withRouter } from 'react-router-dom'
import { Form, Field } from 'react-final-form'
import qs from 'qs'

import EmailField from 'components/fields/EmailField'
import PasswordField from 'components/fields/PasswordField'
import Layout from 'components/Layout'

import styles from './styles.scss'
import authContainer from '../../containers/authContainer';
import ResetPassword from './ResetPassword';

const LoginForm = ({ onSubmit }) => (
  <Form
    onSubmit={onSubmit}
    render={({ handleSubmit, values, ...rest }) => (
      <div data-row>
        <form onSubmit={handleSubmit} data-col="12">
          <div data-field-row>
            <EmailField name="email" label="Email" autoComplete="email" />
          </div>
          <div data-field-row>
            <PasswordField name="password" label="Password" autoComplete="current-password" />
          </div>
          <ResetPassword email={values.email}>
            <span className={styles.reset}>Reset Password</span>
          </ResetPassword>
          <button type="submit">Submit</button>
        </form>
      </div>
    )}
  />
)

const SignupForm = ({ onSubmit }) => (
  <Form
    onSubmit={onSubmit}
    render={({ handleSubmit }) => (
      <div data-row>
        <form onSubmit={handleSubmit} data-col="12">
          <div data-field-row>
            <EmailField name="email" label="Email" autoComplete="email" />
          </div>
          <div data-field-row>
            <EmailField name="email-confirm" label="Confirm Email" autoComplete="off" />
          </div>
          <div data-field-row>
            <PasswordField name="password" label="Password" autoComplete="new-password" />
          </div>
          <button type="submit">Submit</button>
        </form>
      </div>
    )}
  />
)


class Login extends React.Component {
  state = {
    newUser: false,
    submissionError: ''
  }

  login = (data = {}) => {
    const { email, password } = data

    authContainer.login({ email, password })
      .then(() => {
        this.followRedirect()
      })
      .catch((err) => {
        this.setState({ submissionError: err })
      })
  }

  signup = (data = {}) => {
    const { email, password } = data
    authContainer.signupWithEmail({ email, password })
      .then(() => {
        this.followRedirect()
      })
      .catch((err) => {
        this.setState({ submissionError: err })
      })
  }

  followRedirect = () => {
    const { history, location } = this.props

    const queryParams = qs.parse(location.search, { ignoreQueryPrefix: true })
    const redirect = queryParams.redirect || '/account'

    console.log(redirect)

    history.push(redirect)
  }

  renderLogin() {
    return (
      <div data-row>
        <div>
          <h1>Login</h1>

          <LoginForm onSubmit={this.login} />

          <p data-label>First time visitor?</p>
          <button onClick={() => this.setState({ newUser: true })} data-link>
            Create a new account
          </button>
        </div>
      </div>
    )
  }

  renderSignup() {
    return (
      <div data-row>
        <div>
          <h1>Sign Up</h1>

          <SignupForm onSubmit={this.signup} />

          <p data-label>Already have an account?</p>
          <button onClick={() => this.setState({ newUser: false })} data-link>
            Log In
          </button>
        </div>
      </div>
    )
  }

  render() {
    const { submissionError } = this.state

    return (
      <Layout className={styles.transactionFeed}>
        {submissionError && (
          <span>
            {submissionError.toString()}
          </span>
        )}
        {this.state.newUser && this.renderSignup()}
        {!this.state.newUser && this.renderLogin()}
      </Layout>
    )
  }
}

export default withRouter(Login)
