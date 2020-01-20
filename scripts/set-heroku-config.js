const shell = require('shelljs')
const { getEnv } = require('./getConfigVariables')

const output = getEnv()

const env = process.env.NODE_ENV
const deployTarget = env === 'production' ? 'heroku-pingpod' : 'heroku-pingpod-staging'

shell.exec(`heroku config:set ${output} --remote ${deployTarget}`)