import axios from 'axios'
import constants from 'shared/constants'
import authContainer from 'containers/authContainer'

const ENDPOINTS = {
  USERS_CREATE: '/api/users/create',
  USERS_GET: '/api/users/get',
  USERS_SEARCH: '/api/users/search',
  USERS_UPDATE: '/api/users/update',

  CREATE_INVITES: '/api/create-invites',
  GET_INVITES: '/api/get-invites',
  ACCEPT_INVITES: '/api/accept-invites',

  GET_PRODUCTS: '/api/get-products',
  CREATE_PURCHASE: '/api/create-purchases',
  GET_PURCHASES: '/api/get-purchases',

  GET_USERS: '/api/get-users',
  UPDATE_USER_BILLING: '/api/update-user-billing',
  GET_USER_BILLING: '/api/get-user-billing',
  GET_RESERVATIONS: '/api/get-reservations',
  CANCEL_RESERVATIONS: '/api/cancel-reservations',
  GET_ORDER: '/api/get-order',
  GET_AVAILABLE_SESSIONS: '/api/get-available-sessions',
  CREATE_RESERVATIONS: '/api/create-reservations',
  VALIDATE_RESERVATIONS: '/api/validate-reservations',
  UPDATE_USER_INFO: '/api/update-user-info',
  UNLOCK_DOOR: '/api/unlock-door',
  SEND_EMAIL: '/api/send-email',
  GET_UNLOCKS: '/api/get-unlocks'
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
    data: {
      authId: authContainer.userId,
      ...data
    }
  })
    .then((d = {}) => d.data)
    .catch(err => {
      if (err.response && err.response.data) {
        throw err.response.data
      }

      throw err.message
    })
}

export const createUser = (data) => apiRequest({ url: ENDPOINTS.USERS_CREATE, data })
export const getUser = (data) => apiRequest({ url: ENDPOINTS.USERS_GET, data })
export const updateUser = (data) => apiRequest({ url: ENDPOINTS.USERS_UPDATE, data })
export const searchUsers = (data) => apiRequest({ url: ENDPOINTS.USERS_SEARCH, data })

export const getProducts = (data) => apiRequest({ url: ENDPOINTS.GET_PRODUCTS, data })
export const getPurchases = (data) => apiRequest({ url: ENDPOINTS.GET_PURCHASES, data })

export const createPurchases = (data) => apiRequest({ url: ENDPOINTS.CREATE_PURCHASE, data })

export const createInvites = ({
  userId,
  reservations,
}) => {
  return apiRequest({
    url: ENDPOINTS.CREATE_INVITES,
    data: {
      userId,
      reservations
    }
  })
}

export const getInvites = (data) => apiRequest({ url: ENDPOINTS.GET_INVITES, data })
export const acceptInvites = (data) => apiRequest({ url: ENDPOINTS.ACCEPT_INVITES, data })

export const getUnlocks = ({
  userId,
  reservationId
}) => {
  return apiRequest({
    url: ENDPOINTS.GET_UNLOCKS,
    data: {
      userId,
      reservationId
    }
  })
}

export const cancelReservations = (data) => apiRequest({ url: ENDPOINTS.CANCEL_RESERVATIONS, data })

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

export const getReservations = (data) => apiRequest({ url: ENDPOINTS.GET_RESERVATIONS, data })

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

export const getInvite = ({
  inviteId,
  userId
}) => {
  return apiRequest({
    url: ENDPOINTS.GET_INVITE,
    data: {
      inviteId,
      userId
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

export const unlockDoor = (data) => apiRequest({ url: ENDPOINTS.UNLOCK_DOOR, data })

export const sendEmail = ({
  userId,
  subject,
  text,
  html
}) => {
  return apiRequest({
    url: ENDPOINTS.SEND_EMAIL,
    data: {
      userId,
      subject,
      text,
      html
    }
  })
}

export {
  constants
}
