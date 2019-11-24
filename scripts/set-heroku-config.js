const shell = require('shelljs')
const path = require('path')
const { getEnv } = require('./getConfigVariables')

const output = getEnv()

const deployFile = path.resolve(__dirname, './deploy.sh')
console.log(output)
const deployProcess = shell.exec(`heroku config:set ${output}`)