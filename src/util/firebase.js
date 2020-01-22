import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/functions'

const productionConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "pingpod-web.firebaseapp.com",
  databaseURL: "https://pingpod-web.firebaseio.com",
  projectId: "pingpod-web",
  storageBucket: "pingpod-web.appspot.com",
  messagingSenderId: "442129655840",
  appId: "1:442129655840:web:e987b22d01f1fa10"
}

const stagingConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "pingpod-staging.firebaseapp.com",
  databaseURL: "https://pingpod-staging.firebaseio.com",
  projectId: "pingpod-staging",
  storageBucket: "pingpod-staging.appspot.com",
  messagingSenderId: "116321324265",
  appId: "1:116321324265:web:0e108edd64f6b13c283478",
  measurementId: "G-L7D40KPJ5M"
}

const firebaseConfig = process.env.NODE_ENV === 'production' ? productionConfig : stagingConfig

firebase.initializeApp(firebaseConfig)

export const db = firebase.firestore()
export const auth = firebase.auth()
