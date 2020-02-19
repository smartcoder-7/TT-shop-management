import React from 'react'
import { db, auth } from 'util/firebase'

import { Container, Subscribe, Provider } from 'unstated'
import { createUser, getUserBilling } from 'api'

const IS_OFFLINE = !!process.env.IS_OFFLINE

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
        userBilling: {}
      })
    })

    if (IS_OFFLINE) {
      console.log(this.state)
      setTimeout(() => {
        createUser({ id: '12345', email: 'testy@moo.com' })
          .then((user) => {
            this.updateUser(user)
          })
      })
    }
  }

  watchUser({ userId, email }) {
    if (this.unwatchUser) this.unwatchUser()

    const userRef = db.collection('users').doc(userId)
    this.unwatchUser = userRef.onSnapshot(async doc => {
      const user = doc.data()
      if (!user) return
      this.updateUser(user)
    })
  }

  updateUser = async (user) => {
    const userId = user.id

    await this.setState({
      userId,
      user,
      userBilling: null,
      loading: false,
    })

    if (user.hasActiveCard) {
      await this.updateUserBilling()
    }
  }

  updateUserBilling = async () => {
    const userId = this.userId
    if (!userId) return
    const userBilling = await getUserBilling({ userId: this.userId })

    await this.setState({
      userBilling,
    })
  }

  setIdToken = async (force = false) => {
    if (!auth.currentUser) return
    const idTokenResult = await auth.currentUser.getIdTokenResult(force)

    let { token: idToken, expirationTime } = idTokenResult
    const now = Date.now()

    if (now >= expirationTime) {
      await this.setIdToken(true)
      return
    }

    await this.setState({ idToken })
  }

  onLogin = async () => {
    const user = auth.currentUser
    await this.setIdToken(true)
    await this.setState({
      userId: user.uid,
      loading: true,
    })
    this.watchUser({ userId: user.uid, email: user.email })
  }

  login = async ({ email = "", password = "" }) => {
    try {
      const res = await auth.signInWithEmailAndPassword(email, password)
      console.log('LOGIN', res.user)
      const userId = res.user.uid
      await this.setState({ user: { id: userId } })
      await createUser({ id: userId, email })
      await this.onLogin()
    } catch (error) {
      console.log('LOGIN ERROR', error)
      throw error
    }
  }

  signupWithEmail = async ({ email = "", password = "" }) => {
    try {
      await auth.createUserWithEmailAndPassword(email, password)
      await this.login({ email, password })
      // sendEmail({
      //   email, 
      //   subject: 'Welcome to PingPod',
      //   text: 'Thanks for creating an account!' 
      // })
    } catch (error) {
      console.log('SIGNUP ERROR', error)
      throw error
    }
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
