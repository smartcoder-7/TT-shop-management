import axios from 'axios'
import constants from 'shared/constants'
import authContainer from 'containers/authContainer'

const ENDPOINTS = {
  GET_USER: '/api/get-user',
  CREATE_PURCHASE: '/api/create-purchase',
  CREATE_USER: '/api/create-user',

  CREATE_INVITES: '/api/create-invites',
  GET_INVITES: '/api/get-invites',
  ACCEPT_INVITES: '/api/accept-invites',

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

export const createPurchase = ({
  userId,
  locationId,
  purchase
}) => {
  return apiRequest({
    url: ENDPOINTS.CREATE_PURCHASE,
    data: {
      userId,
      locationId,
      purchase
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

export const cancelReservations = ({
  userId,
  reservations,
  refund
}) => {
  return apiRequest({
    url: ENDPOINTS.CANCEL_RESERVATIONS,
    data: {
      userId,
      reservations,
      refund
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
  isMember,
  isAdmin
}) => {
  return apiRequest({
    url: ENDPOINTS.UPDATE_USER_INFO,
    data: {
      userId,
      firstName,
      lastName,
      isMember,
      isAdmin
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
