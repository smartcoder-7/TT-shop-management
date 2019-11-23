const admin = require('firebase-admin')

admin.initializeApp({
  credential: admin.credential.cert({
    "type": "service_account",
    "project_id": "pingpod-web",
    "private_key_id": process.env.FIREBASE_ADMIN_PRIVATE_KEY_ID,
    "private_key": process.env.FIREBASE_ADMIN_PRIVATE_KEY,
    "client_email": FIREBASE_ADMIN_CLIENT_EMAIL,
    "client_id": FIREBASE_ADMIN_CLIENT_ID,
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-yjpam%40pingpod-web.iam.gserviceaccount.com"
  }),
  databaseURL: "https://pingpod-web.firebaseio.com"
});

const db = admin.firestore()

module.exports = db