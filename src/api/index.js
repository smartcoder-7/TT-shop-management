import axios from 'axios'
import * as constants from 'util/constants'
import authContainer from 'containers/authContainer'

const ENDPOINTS = {
  GET_USER: '/api/get-user',
  CREATE_USER: '/api/create-user',
  UPDATE_USER_BILLING: '/api/update-user-billing',
  GET_USER_BILLING: '/api/get-user-billing',
  GET_RESERVATIONS: '/api/get-reservations',
  GET_ORDER: '/api/get-order',
  GET_AVAILABLE_SESSIONS: '/api/get-available-sessions',
  CREATE_RESERVATIONS: '/api/create-reservations',
  UPDATE_USER_INFO: '/api/update-user-info'
}

const apiRequest = ({ url, data }) => {
  return axios({
    method: 'POST',
    headers: {
      Authorization: `Bearer ${authContainer.idToken}`,
    },
    url,
    data
  })
}

export const getUser = ({
  userId,
}) => {
  return apiRequest({
    url: ENDPOINTS.GET_USER,
    data: {
      userId,
    }
  })
}

export const createUser = ({
  userId,
  email
}) => {
  return apiRequest({
    url: ENDPOINTS.CREATE_USER,
    data: {
      userId,
      email
    }
  }).then(d => d.data)
}

export const updateUserBilling = ({
  userId,
  customerId,
  token
}) => {
  return apiRequest({
    url: ENDPOINTS.UPDATE_USER_BILLING,
    data: {
      userId,
      customerId,
      token
    }
  }).then(d => d.data)
}

export const updateUserInfo = ({
  userId,
  firstName,
  lastName
}) => {
  return apiRequest({
    url: ENDPOINTS.UPDATE_USER_INFO,
    data: {
      userId,
      firstName,
      lastName
    }
  }).then(d => d.data)
}

export const getUserBilling = ({
  userId,
}) => {
  return apiRequest({
    url: ENDPOINTS.GET_USER_BILLING,
    data: {
      userId,
    }
  }).then(d => d.data)
}

export const getReservations = ({
  userId,
  locationId,
  reservationTime,
  startTime,
  endTime,
}) => {
  return apiRequest({
    url: ENDPOINTS.GET_RESERVATIONS,
    data: {
      userId,
      locationId,
      reservationTime,
      startTime,
      endTime
    }
  }).then(d => d.data)
}

export const getOrder = ({
  orderId,
  userId,
}) => {
  return apiRequest({
    url: ENDPOINTS.GET_ORDER,
    data: {
      orderId,
      userId,
    }
  }).then(d => d.data)
}
export const getAvailableSessions = ({
  locationId,
  startTime,
  endTime
}) => {
  return apiRequest({
    url: ENDPOINTS.GET_AVAILABLE_SESSIONS,
    data: {
      locationId,
      startTime,
      endTime
    }
  }).then(d => d.data)
}

export const createReservations = ({
  reservations,
  userId,
}) => {
  return apiRequest({
    url: ENDPOINTS.CREATE_RESERVATIONS,
    data: {
      userId,
      reservations
    }
  }).then(d => d.data)
}

export {
  constants
}
