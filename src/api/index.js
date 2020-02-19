import axios from 'axios'
import constants from 'shared/constants'
import authContainer from 'containers/authContainer'

const ENDPOINTS = {
  USERS_CREATE: '/api/users/create',
  USERS_GET: '/api/users/get',
  USERS_SEARCH: '/api/users/search',
  USERS_UPDATE: '/api/users/update',

  INVITES_CREATE: '/api/invites/create',
  INVITES_CREATE_MULTIPLE: '/api/invites/create-multiple',
  INVITES_GET: '/api/invites/get',
  INVITES_SEARCH: '/api/invites/search',
  INVITES_UPDATE: '/api/invites/update',

  UNLOCKS_CREATE: '/api/unlocks/create',
  UNLOCKS_SEARCH: '/api/unlocks/search',

  PRODUCTS_CREATE: '/api/products/create',
  PRODUCTS_UPDATE: '/api/products/update',
  PRODUCTS_SEARCH: '/api/products/search',

  ACCEPT_INVITES: '/api/accept-invites',

  GET_PRODUCTS: '/api/get-products',
  CREATE_PURCHASE: '/api/create-purchases',
  GET_PURCHASES: '/api/get-purchases',

  GET_USER_BILLING: '/api/get-user-billing',
  GET_RESERVATIONS: '/api/get-reservations',
  CANCEL_RESERVATIONS: '/api/cancel-reservations',
  GET_ORDER: '/api/get-order',
  GET_AVAILABLE_SESSIONS: '/api/get-available-sessions',
  CREATE_RESERVATIONS: '/api/create-reservations',
  VALIDATE_RESERVATIONS: '/api/validate-reservations',
  SEND_EMAIL: '/api/send-email',
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

export const createInvite = (data) => apiRequest({ url: ENDPOINTS.INVITES_CREATE, data })
export const createInvites = (data) => apiRequest({ url: ENDPOINTS.INVITES_CREATE_MULTIPLE, data })
export const getInvite = (data) => apiRequest({ url: ENDPOINTS.INVITES_GET, data })
export const updateInvite = (data) => apiRequest({ url: ENDPOINTS.INVITES_UPDATE, data })
export const searchInvites = (data) => apiRequest({ url: ENDPOINTS.INVITES_SEARCH, data })

export const createUnlock = (data) => apiRequest({ url: ENDPOINTS.UNLOCKS_CREATE, data })
export const searchUnlocks = (data) => apiRequest({ url: ENDPOINTS.UNLOCKS_SEARCH, data })

export const createProduct = (data) => apiRequest({ url: ENDPOINTS.PRODUCTS_CREATE, data })
export const updateProduct = (data) => apiRequest({ url: ENDPOINTS.PRODUCTS_UPDATE, data })
export const searchProducts = (data) => apiRequest({ url: ENDPOINTS.PRODUCTS_SEARCH, data })


export const getProducts = (data) => apiRequest({ url: ENDPOINTS.GET_PRODUCTS, data })
export const getPurchases = (data) => apiRequest({ url: ENDPOINTS.GET_PURCHASES, data })

export const createPurchases = (data) => apiRequest({ url: ENDPOINTS.CREATE_PURCHASE, data })


export const acceptInvites = (data) => apiRequest({ url: ENDPOINTS.ACCEPT_INVITES, data })

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
