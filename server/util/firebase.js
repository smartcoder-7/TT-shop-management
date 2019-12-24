const { mockUser, mockReservation, mockOrder } = require('../../shared/mockData')
const mock = require('firebase-mock')
const admin = require('firebase-admin')

const IS_OFFLINE = !!process.env.IS_OFFLINE

if (!IS_OFFLINE) {
  admin.initializeApp({
    credential: admin.credential.cert({
      "type": "service_account",
      "project_id": "pingpod-web",
      "private_key_id": process.env.FIREBASE_ADMIN_PRIVATE_KEY_ID,
      "private_key": process.env.FIREBASE_ADMIN_PRIVATE_KEY,
      "client_email": process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      "client_id": process.env.FIREBASE_ADMIN_CLIENT_ID,
      "auth_uri": "https://accounts.google.com/o/oauth2/auth",
      "token_uri": "https://oauth2.googleapis.com/token",
      "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
      "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-yjpam%40pingpod-web.iam.gserviceaccount.com"
    }),
    databaseURL: "https://pingpod-web.firebaseio.com"
  })
}

const db = IS_OFFLINE ? new mock.MockFirestore() : admin.firestore()
const auth = IS_OFFLINE ? new mock.MockAuthentication() : admin.auth()

if (IS_OFFLINE) {
  db.collection('users').doc(mockUser.id).set(mockUser)
  db.collection('reservations').doc(mockReservation.id).set(mockReservation)
  db.collection('orders').doc(mockOrder.id).set(mockOrder)

  setInterval(() => {
    db.collection('users').autoFlush();
    db.collection('reservations').autoFlush();
    db.collection('orders').autoFlush();
  }, 1000)
}

module.exports = {
  db,
  auth
}
