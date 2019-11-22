const fs = require('fs-extra')
const path = require('path')
const allSecrets = require('./secrets.json')

const ROOT_DIR = __dirname

const isDev = process.env.NODE_ENV === 'development'
const secrets = isDev ? 
  allSecrets.development : 
  allSecrets.production

const getEnvFile = () => {
  let str = ''

  Object.keys(secrets).forEach((key) => {
    str += `${key}=${secrets[key]} `
  })

  return str
}

const getHerokuConfigFile = () => {
  let str = `
    heroku config:add ${getEnvFile()}
  `
  return str
}

fs.writeFileSync(
  path.resolve(ROOT_DIR, '.env'), 
  getEnvFile()
)

fs.writeFileSync(
  path.resolve(ROOT_DIR, 'setup-heroku.sh'), 
  getHerokuConfigFile()
)