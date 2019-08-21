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

class AuthContainer extends Container {
  state = {
    userId: null,
    user: {}
  }

  constructor() {
    super()

    firebase.auth()
    .onAuthStateChanged(user => {
      if (user) {
        this.setState({ 
          userId: user.uid,
          user,
        })
      } else {
        this.setState({ 
          userId: null,
          user: {},
        })
      }
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