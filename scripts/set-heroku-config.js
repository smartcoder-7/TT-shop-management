const shell = require('shelljs')
const { getEnv } = require('./getConfigVariables')

const output = getEnv()

shell.exec(`${output.deployTarget} config:set ${output}`)