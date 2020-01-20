const shell = require('shelljs')
const { getEnv } = require('./getConfigVariables')

const output = getEnv()

console.log(output)

shell.exec(`heroku config:set ${output} --remote ${output.deployTarget}`)