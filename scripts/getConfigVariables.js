const fs = require('fs-extra')
const path = require('path')
const allSecrets = require('../secrets.json')

const ROOT_DIR = __dirname

const IS_OFFLINE = process.env.IS_OFFLINE === "true"
const isDev = process.env.NODE_ENV === 'development'

const secrets = isDev ?
  allSecrets.development :
  allSecrets.production

const envVars = {
  ...secrets,
  IS_OFFLINE
}

const getEnv = () => {
  let str = ''

  Object.keys(envVars).forEach((key) => {
    const val = envVars[key]
    str += `${key}="${val}" `
  })

  return str
}

const getDotEnv = (separator = ' ') => {
  let str = ''

  Object.keys(envVars).forEach((key) => {
    let val = envVars[key]
    if (typeof val === 'string') {
      val = val.replace(/\n/g, '\\n')
    }
    str += `${key}="${val}"\n`
  })

  return str
}

module.exports = {
  getEnv,
  getDotEnv
}
