import axios from 'axios'

const ENDPOINTS = {
  CREATE_USER: '/api/create-user',
  UPDATE_USER_BILLING: '/api/update-user-billing',
  GET_USER_BILLING: '/api/get-user-billing',
}

export const createUser = ({ userId, email }) => {
  return axios({
    method: 'POST',
    url: ENDPOINTS.CREATE_USER,
    data: {
      userId,
      email
    }
  })
}

export const updateUserBilling = ({ userId, customerId, token }) => {
  return axios({
    method: 'POST',
    url: ENDPOINTS.UPDATE_USER_BILLING,
    data: {
      userId,
      customerId, 
      token
    }
  })
}

export const getUserBilling = ({ userId, customerId, token }) => {
  return axios({
    method: 'POST',
    url: ENDPOINTS.GET_USER_BILLING,
    data: {
      userId,
    }
  }).then(d => d.data)
}