import React from 'react'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import { Container, Subscribe, Provider } from 'unstated'

const firebaseConfig = {
  apiKey: "AIzaSyB6hVfDS4tKY6R6oD7Z8l1uAejQEulSsVs",
  authDomain: "pingpod-web.firebaseapp.com",
  databaseURL: "https://pingpod-web.firebaseio.com",
  projectId: "pingpod-web",
  storageBucket: "pingpod-web.appspot.com",
  messagingSenderId: "442129655840",
  appId: "1:442129655840:web:e987b22d01f1fa10"
}

firebase.initializeApp(firebaseConfig)

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

  constructor() {
    super()

    firebase.auth()
    .onAuthStateChanged(user => {
      if (user) {
        const userRef = db.collection('users').doc(user.uid)

        userRef.get()
        .then(doc => {
          if (!doc.exists) {
            userRef.set({ 
              email: user.email,
              uid: user.uid,
            })

            return
          }

          const userData = doc.data()

          this.setState({ 
            userId: user.uid,
            user: userData,
            loading: false,
          })
        })
        .catch(err => {
          console.log('Unable to complete login.', err)
        })

        return
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
      console.log(res.user)
    })
    .catch((error) => {
      // Handle Errors here.
      var errorCode = error.code
      var errorMessage = error.message
      console.log('LOGIN ERROR', error)
      throw error
      // ...
    })
  }

  signupWithEmail = ({ email = "", password = ""}) => {
    return firebase.auth()
    .createUserWithEmailAndPassword(email, password)
    .catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code
      var errorMessage = error.message
      // ...
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