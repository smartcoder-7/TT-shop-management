import React from 'react'
import firebase from 'firebase/app'
import { Form, Field } from 'react-final-form'
import Layout from 'components/Layout'

import styles from './styles.scss'
import authContainer from '../../containers/authContainer';

const LoginForm = ({ onSubmit }) => (
  <Form
    onSubmit={onSubmit}
    render={({ handleSubmit }) => (
      <form onSubmit={handleSubmit}>
        <Field
          name="email"
          render={({ input, meta }) => (
            <div>
              <input type="email" {...input} />
              {meta.touched && meta.error && <span>{meta.error}</span>}
            </div>
          )}
        />

        <Field
          name="password"
          render={({ input, meta }) => (
            <div>
              <input type="password" {...input} />
              {meta.touched && meta.error && <span>{meta.error}</span>}
            </div>
          )}
        />

        <button type="submit">Submit</button>
      </form>
    )}
  />
)

class PodSchedule extends React.Component {
  constructor(props) {
    super(props)
  }

  login = (data = {}) => {
    const { email, password } = data
    authContainer.login({ email, password })
  }

  render() {
    return (
      <Layout className={styles.transactionFeed}>
        <h1>Login</h1>

        <LoginForm onSubmit={this.login} />
      </Layout>
    )
  }
}

export default PodSchedule
