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

let db, auth

try {
  firebase.initializeApp(config)

  db = firebase.firestore()
  auth = firebase.auth()

} catch (err) {
  console.log(err)

  db = {}
  auth = {
    onAuthStateChanged: (callback) => {
      callback()
    }
  }
}


export {
  db,
  auth
}
