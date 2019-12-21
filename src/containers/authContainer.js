import React from 'react'
import { db, auth } from 'util/firebase'

import { Container, Subscribe, Provider } from 'unstated'
import { createUser, getUserBilling } from 'api'

class AuthContainer extends Container {
  state = {
    loading: true,
    userId: null,
    user: {},
    idToken: null,
  }

  get userId() { return this.user ? this.user.id : null }
  get idToken() { return this.state.idToken }
  get user() { return this.state.user }
  get userBilling() { return this.state.userBilling }

  constructor() {
    super()

    auth.onAuthStateChanged(async user => {
      if (user) {
        this.onLogin()
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

  watchUser() {
    if (this.unwatchUser) this.unwatchUser()
    if (!auth.currentUser) return

    const { uid: userId, email } = auth.currentUser
    createUser({ userId, email })
      .then(() => {
        const userRef = db.collection('users').doc(userId)
        this.unwatchUser = userRef.onSnapshot(async doc => {
          const user = doc.data()

          if (user.hasActiveCard) {
            const userBilling = await getUserBilling({ userId })
            await this.setState({ userBilling })
          }

          this.setState({
            userId,
            user,
            loading: false,
          })
        })
      })
  }

  onLogin = async () => {
    const user = auth.currentUser
    const idToken = await auth.currentUser.getIdToken()
    await this.setState({
      idToken,
      userId: user.uid,
      loading: true,
    })
    this.watchUser()
  }

  login = ({ email = "", password = "" }) => {
    return auth.signInWithEmailAndPassword(email, password)
      .then((res) => {
        console.log('LOGIN', res.user)
        return this.onLogin()
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
    return new Promise((resolve, reject) => {
      auth.sendPasswordResetEmail(email)
        .then(resolve)
        .catch(reject);
    })
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
