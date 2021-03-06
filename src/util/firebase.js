import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/functions'

const API_KEY = process.env.FIREBASE_API_KEY
const PROJECT_ID = process.env.FIREBASE_PROJECT_ID
const APP_ID = process.env.FIREBASE_APP_ID

const config = {
  apiKey: API_KEY,
  authDomain: `${PROJECT_ID}.firebaseapp.com`,
  databaseURL: `https://${PROJECT_ID}.firebaseio.com`,
  projectId: PROJECT_ID,
  storageBucket: `${PROJECT_ID}.appspot.com`,
  appId: APP_ID,
}

firebase.initializeApp(config)

const db = firebase.firestore()
const auth = firebase.auth()

export {
  db,
  auth
}
