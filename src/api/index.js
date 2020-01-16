import axios from 'axios'
import * as constants from 'util/constants'
import authContainer from 'containers/authContainer'

const ENDPOINTS = {
  GET_USER: '/api/get-user',
  CREATE_USER: '/api/create-user',
  GET_USERS: '/api/get-users',
  UPDATE_USER_BILLING: '/api/update-user-billing',
  GET_USER_BILLING: '/api/get-user-billing',
  GET_RESERVATIONS: '/api/get-reservations',
  GET_ORDER: '/api/get-order',
  GET_AVAILABLE_SESSIONS: '/api/get-available-sessions',
  CREATE_RESERVATIONS: '/api/create-reservations',
  VALIDATE_RESERVATIONS: '/api/validate-reservations',
  UPDATE_USER_INFO: '/api/update-user-info',
  UNLOCK_DOOR: '/api/unlock-door'
}

const apiRequest = async ({ url, data }) => {
  await authContainer.setIdToken()
  const idToken = authContainer.idToken

  return axios({
    method: 'POST',
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
    url,
    data
  })
    .then((d = {}) => d.data)
    .catch(err => {
      if (err.response && err.response.data) {
        throw err.response.data
      }

      throw err.message
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

export const getUsers = () => {
  return apiRequest({
    url: ENDPOINTS.GET_USERS,
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
  })
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
  })
}

export const updateUserInfo = ({
  userId,
  firstName,
  lastName,
  isMember
}) => {
  return apiRequest({
    url: ENDPOINTS.UPDATE_USER_INFO,
    data: {
      userId,
      firstName,
      lastName,
      isMember
    }
  })
}

export const getUserBilling = ({
  userId,
}) => {
  return apiRequest({
    url: ENDPOINTS.GET_USER_BILLING,
    data: {
      userId,
    }
  })
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
  })
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
  })
}
export const getAvailableSessions = ({
  userId,
  locationId,
  startTime,
  endTime
}) => {
  return apiRequest({
    url: ENDPOINTS.GET_AVAILABLE_SESSIONS,
    data: {
      userId,
      locationId,
      startTime,
      endTime
    }
  })
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
  })
}

export const validateReservations = ({
  reservations,
  userId,
}) => {
  return apiRequest({
    url: ENDPOINTS.VALIDATE_RESERVATIONS,
    data: {
      userId,
      reservations
    }
  })
}

export const unlockDoor = ({
  reservationId,
  userId,
}) => {
  return apiRequest({
    url: ENDPOINTS.UNLOCK_DOOR,
    data: {
      userId,
      reservationId
    }
  })
}

export {
  constants
}
