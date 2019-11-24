const fs = require('fs-extra')
const path = require('path')
const allSecrets = require('../secrets.json')

const ROOT_DIR = __dirname

const isDev = process.env.NODE_ENV === 'development'
const secrets = isDev ? 
  allSecrets.development : 
  allSecrets.production

const getConfigVariables = () => {
  let str = ''

  Object.keys(secrets).forEach((key) => {
    const val = secrets[key].replace(/\n/g, '')
    str += `${key}="${val}"/n`
  })

  return `'${str}'`
}

module.exports = getConfigVariables