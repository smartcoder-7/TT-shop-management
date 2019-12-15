import React from 'react'
import { db, auth } from 'util/firebase'

import { Container, Subscribe, Provider } from 'unstated'
import { createUser, getUserBilling } from 'api'

class AuthContainer extends Container {
  state = {
    loading: true,
    userId: null,
    user: {},
    idToken: null
  }

  get userId() {
    if (!this.state.user) return null
    return this.state.user.id
  }

  get idToken() { return this.state.idToken }
  get user() { return this.state.user }
  get userBilling() { return this.state.userBilling }

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
          }).then(this.updateUserBilling)

        })
      })
  }

  updateUserBilling = () => {
    if (!this.user || !this.user.hasActiveCard) return

    getUserBilling({ userId: this.user.id })
      .then(userBilling => {
        this.setState({ userBilling })
      })
  }

  constructor() {
    super()

    auth.onAuthStateChanged(async user => {
      if (user) {
        const idToken = await auth.currentUser.getIdToken()
        await this.setState({ idToken })
        this.watchUser(user)
        return
      }

      if (this.unwatchUser) {
        this.unwatchUser()
      }

      this.setState({
        userId: null,
        user: {},
        loading: false,
        idToken: null,
      })
    })
  }

  login = ({ email = "", password = "" }) => {
    return auth.signInWithEmailAndPassword(email, password)
      .then((res) => {
        console.log('LOGIN', res.user)
      })
      .catch((error) => {
        console.log('LOGIN ERROR', error)
        throw error
        // ...
      })
  }

  signupWithEmail = ({ email = "", password = "" }) => {
    return auth.createUserWithEmailAndPassword(email, password)
      .then(() => {
        // sendEmail({
        //   email, 
        //   subject: 'Welcome to PingPod',
        //   text: 'Thanks for creating an account!' 
        // })
      })
      .catch(function (error) {
        console.log('SIGNUP ERROR', error)
        throw error
      })
  }

  logout = () => {
    return auth.signOut()
      .then(() => {
        console.log('logged out!')
        window.location = '/login'
      })
  }

  triggerChange = () => {
    this.setState({})
  }

  resetPassword = ({ email = "" }) => {
    return auth.sendPasswordResetEmail(email).then(function () {
      // Email sent.
    }).catch(function (error) {
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
