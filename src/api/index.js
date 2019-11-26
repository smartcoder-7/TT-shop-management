import axios from 'axios'
import constants from './constants'

const ENDPOINTS = {
  CREATE_USER: '/api/create-user',
  UPDATE_USER_BILLING: '/api/update-user-billing',
  GET_USER_BILLING: '/api/get-user-billing',
  GET_RESERVATIONS: '/api/get-reservations',
  GET_AVAILABLE_SESSIONS: '/api/get-available-sessions'
}

export const createUser = ({
  userId,
  email
}) => {
  return axios({
    method: 'POST',
    url: ENDPOINTS.CREATE_USER,
    data: {
      userId,
      email
    }
  })
}

export const updateUserBilling = ({
  userId,
  customerId,
  token
}) => {
  return axios({
    method: 'POST',
    url: ENDPOINTS.UPDATE_USER_BILLING,
    data: {
      userId,
      customerId,
      token
    }
  }).then(d => d.data)
}

export const getUserBilling = ({
  userId,
  customerId,
  token
}) => {
  return axios({
    method: 'POST',
    url: ENDPOINTS.GET_USER_BILLING,
    data: {
      userId,
    }
  }).then(d => d.data)
}

export const getReservations = ({
  userId,
  locationId,
  reservationTime
}) => {
  return axios({
    method: 'POST',
    url: ENDPOINTS.GET_RESERVATIONS,
    data: {
      userId,
      locationId,
      reservationTime
    }
  }).then(d => d.data)
}

export const getAvailableSessions = ({
  locationId,
  startTime,
  endTime
}) => {
  return axios({
    method: 'POST',
    url: ENDPOINTS.GET_AVAILABLE_SESSIONS,
    data: {
      locationId,
      startTime,
      endTime
    }
  }).then(d => d.data)
}

export {
  constants
}