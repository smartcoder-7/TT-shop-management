import firebase from 'firebase/app'

const db = firebase.firestore()

export const getAccessCode = (id) => {
  const ref = db.collection('accessCodes').doc(id)

  return ref.get()
  .then(doc => {
    if (!doc.exists) {
      return undefined
    }

    return doc.data()
  })
}

export const getPod = (id) => {
  const ref = db.collection('pods').doc(id)

  return ref.get()
  .then(doc => {
    if (!doc.exists) {
      return undefined
    }

    return doc.data()
  })
}

export const getUser = (id) => {
  const ref = db.collection('users').doc(id)

  return ref.get()
  .then(doc => {
    if (!doc.exists) {
      return undefined
    }

    return doc.data()
  })
}

export const updateUser = (id, data = {}) => {
  const ref = db.collection('users').doc(id)

  return ref.update({
    ...(data.firstName && { firstName: data.firstName }),
    ...(data.lastName && { lastName: data.lastName }),
    ...(data.activeCard && { activeCard: data.activeCard }),
  })
}