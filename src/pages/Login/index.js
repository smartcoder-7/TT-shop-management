import React from 'react'
import firebase from 'firebase/app'
import Layout from 'components/Layout'

import styles from './styles.scss'

class PodSchedule extends React.Component {
  constructor(props) {
    super(props)
  }

  onSubmit = (e) => {
    e.preventDefault();
    console.log('eyyy')

    const email = 'christine@pingpod.nyc'
    const password = 'password'

    firebase.auth()
    .signInWithEmailAndPassword(email, password)
    .then((res) => {
      console.log(res.user)
    })
    .catch((error) => {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // ...
    })
  }

  render() {
    return (
      <Layout className={styles.transactionFeed}>
        <h1>Login</h1>

        <form onSubmit={this.onSubmit}>
          <input type="email" />
          <input type="password" />
          <button>Log In</button>
        </form>
      </Layout>
    )
  }
}

export default PodSchedule
