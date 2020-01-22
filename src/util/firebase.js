import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/functions'

const { FIREBASE_API_KEY, FIREBASE_PROJECT_ID, FIREBASE_APP_ID } = process.env

const config = {
  apiKey: FIREBASE_API_KEY,
  authDomain: `${FIREBASE_PROJECT_ID}.firebaseapp.com`,
  databaseURL: `https://${FIREBASE_PROJECT_ID}.firebaseio.com`,
  projectId: FIREBASE_PROJECT_ID,
  storageBucket: `${FIREBASE_PROJECT_ID}.appspot.com`,
  appId: FIREBASE_APP_ID,
}

firebase.initializeApp(config)

export const db = firebase.firestore()
export const auth = firebase.auth()
