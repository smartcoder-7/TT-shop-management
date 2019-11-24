const fs = require('fs-extra')
const path = require('path')
const allSecrets = require('../secrets.json')

const ROOT_DIR = __dirname

const isDev = process.env.NODE_ENV === 'development'
const secrets = isDev ? 
  allSecrets.development : 
  allSecrets.production

const getEnv = () => {
  let str = ''

  Object.keys(secrets).forEach((key) => {
    const val = secrets[key]
    str += `${key}="${val}" `
  })

  return str
}

const getDotEnv = (separator = ' ') => {
  let str = ''

  Object.keys(secrets).forEach((key) => {
    const val = secrets[key].replace(/\n/g, '\\n')
    str += `${key}="${val}"\n`
  })

  return str
}

module.exports = {
  getEnv,
  getDotEnv
}