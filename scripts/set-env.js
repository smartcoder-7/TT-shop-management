const fs = require('fs-extra')
const path = require('path')
const getConfigVariables = require('./getConfigVariables')

fs.writeFileSync(
  path.resolve(__dirname, '../.env'),
  getConfigVariables('\n')
)