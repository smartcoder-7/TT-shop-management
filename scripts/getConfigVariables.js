const secrets = require('../secrets.json')

const ENV_PUBLIC = {
  offline: {
    IS_OFFLINE: true
  }
}

const env = process.env.NODE_ENV

const envVars = {
  NODE_ENV: env,
  ...(secrets[env] || secrets.development),
  ...(ENV_PUBLIC[env] || {})
}

const getEnv = () => {
  let str = ''

  Object.keys(envVars).forEach((key) => {
    const val = envVars[key]
    str += `${key}="${val}" `
  })

  return str
}

const getDotEnv = () => {
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
