import React from 'react'
import firebase from 'util/firebase'

import { Container, Subscribe, Provider } from 'unstated'
import { createCustomer } from 'util/square'

const db = firebase.firestore()

class AuthContainer extends Container {
  state = {
    loading: true,
    userId: null,
    user: {}
  }

  get userId() {
    return this.state.userId
  }

  get user() {
    return this.state.user
  }

  watchUser() {
    if (this.unwatchUser) {
      this.unwatchUser()
    }

    if (!this.userId) {
      return
    }

    const userRef = db.collection('users').doc(this.userId)

    this.unwatchUser = userRef
    .onSnapshot(doc => {
      if (!doc.exists) {
        userRef.set({ 
          email: this.user.email,
          uid: this.user.uid,
        })

        return
      }

      const userData = doc.data()

      if (!userData.squareId) {
        createCustomer(userData)
        .then(customer => {
          const squareId = customer.id
          userRef.update({ squareId })
        })

        return
      }

      this.setState({ 
        userId: this.user.uid,
        user: userData,
        loading: false,
      })
    })
  }

  constructor() {
    super()

    firebase.auth()
    .onAuthStateChanged(user => {
      const lastUid = this.userId

      if (user) {
        this.setState({ 
          userId: user.uid,
          user: user,
          loading: false,
        }).then(() => {
          if (user.uid !== lastUid) {
            this.watchUser()
          }
        })
        return
      } 

      if (this.unwatchUser) {
        this.unwatchUser()
      }

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
    })
  }

  triggerChange = () => {
    this.setState({})
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