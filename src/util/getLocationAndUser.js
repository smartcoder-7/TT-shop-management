import firebase from 'firebase/app'

const db = firebase.firestore()

const getLocationAndUser = (locationId, userId) => {
  const locationRef = db.collection('pods').doc(locationId)
  const userRef = db.collection('users').doc(userId)

  return Promise.all([
    locationRef.get(),
    userRef.get(),
  ]).then(([ locationDoc, userDoc ]) => {
    if (!locationDoc.exists) {
      throw `Invalid location id: [${locationId}]`
    }

    if (!userDoc.exists) {
      throw `Invalid user id: [${userId}]`
    }

    return { 
      location: locationDoc.data(),
      user: userDoc.data(),
    }
  })
}

export default getLocationAndUser