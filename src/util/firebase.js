import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/functions'

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

export const db = firebase.firestore()
export const auth = firebase.auth()
