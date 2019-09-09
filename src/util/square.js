import firebase from 'util/firebase'

const functions = firebase.functions()
const newCustomer = functions.httpsCallable('newCustomer')

export const createCustomer = ({ email, uid }) => {
  return newCustomer({
    email_address: email,
    reference_id: uid,
  }).then(({ data = {} }) => {
    return data.customer
  })
}
