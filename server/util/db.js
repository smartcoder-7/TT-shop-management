const admin = require('firebase-admin')
const serviceAccount = require('../secrets/firebase-serviceAccountKey.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://pingpod-web.firebaseio.com"
});

const db = admin.firestore()

module.exports = db