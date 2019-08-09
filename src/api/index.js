import axios from 'axios'

const BASE_URL = 'https://solarville.blocktech.dk'

const ENDPOINTS = {
  LOGIN: `${BASE_URL}/api/v1/auth/tokens/issue`,
  ALL_TRANSACTIONS: `${BASE_URL}/api/pub/transactions`,
  ALL_HOMES: `${BASE_URL}/api/pub/homes`
}

export const login = ({ userName, password }) => {
  return axios({
    method: 'POST',
    url: ENDPOINTS.LOGIN,
    data: {
      userName, 
      password
    }
  })
  .then(response => {
    return response.data.data
  })
}

export const getTransactions = (options = {}) => {
  return axios({
    url: ENDPOINTS.ALL_TRANSACTIONS,
    method: 'GET',
    params: {
      limit: options.limit || 10
    }
  })
  .then(response => {
    return response.data.data
  })
}

export const getHomes = () => {
  return axios({
    method: 'GET',
    url: ENDPOINTS.ALL_HOMES,
  })
  .then(response => {
    return response.data.data
  })
}