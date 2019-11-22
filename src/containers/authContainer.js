import React from 'react'
import firebase from 'util/firebase'

import { Container, Subscribe, Provider } from 'unstated'
import { createUser } from 'api'

const db = firebase.firestore()

class AuthContainer extends Container {
  state = {
    loading: true,
    userId: null,
    user: {}
  }

  get userId() {
    if (!this.state.user) return null
    return this.state.user.id
  }

  get user() {
    return this.state.user
  }

  watchUser(user) {
    if (this.unwatchUser) this.unwatchUser()
    if (!user) return

    const userId = user.uid
    createUser({ userId, email: user.email })
    .then(() => {
      const userRef = db.collection('users').doc(userId)
      this.unwatchUser = userRef.onSnapshot(doc => {
        const userData = doc.data()
  
        this.setState({ 
          userId: user.uid,
          user: userData,
          loading: false,
        })
      })
    })
  }

  constructor() {
    super()

    firebase.auth()
    .onAuthStateChanged(user => {
      const lastUid = this.userId

      if (user) {
        this.watchUser(user)
        return
      } 

      this.unwatchUser()
      this.setState({ 
        userId: null,
        user: {},
        loading: false,
      })
    })
  }

  login = ({ email = "", password = ""}) => {
    return firebase.auth()
    .signInWithEmailAndPassword(email, password)
    .then((res) => {
      console.log('LOGIN', res.user)
    })
    .catch((error) => {
      console.log('LOGIN ERROR', error)
      throw error
      // ...
    })
  }

  signupWithEmail = ({ email = "", password = ""}) => {
    return firebase.auth()
    .createUserWithEmailAndPassword(email, password)
    .then(() => {
      // sendEmail({
      //   email, 
      //   subject: 'Welcome to PingPod',
      //   text: 'Thanks for creating an account!' 
      // })
    })
    .catch(function(error) {
      console.log('SIGNUP ERROR', error)
      throw error
    })
  }

  logout = () => {
    return firebase.auth()
    .signOut()
    .then(() => {
      console.log('logged out!')
      window.location = '/login'
    })
  }

  triggerChange = () => {
    this.setState({})
  }

  resetPassword = ({ email = "" }) => {
    return firebase.auth().sendPasswordResetEmail(email).then(function() {
      // Email sent.
    }).catch(function(error) {
      // An error happened.
    });
  }
}

const authContainer = new AuthContainer()

export default authContainer

export const AuthSubscriber = ({ children }) => (
  <Provider>
    <Subscribe to={[authContainer]}>
      {children}
    </Subscribe>
  </Provider>
)