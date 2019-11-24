const fs = require('fs-extra')
const path = require('path')
const { getDotEnv } = require('./getConfigVariables')

fs.writeFileSync(
  path.resolve(__dirname, '../.env'),
  getDotEnv()
)