const shell = require('shelljs')
const path = require('path')
const getConfigVariables = require('./getConfigVariables')

const output = getConfigVariables()

const deployFile = path.resolve(__dirname, './deploy.sh')
console.log(`${deployFile} ${output}`)
const deployProcess = shell.exec(`${deployFile} ${output}`)