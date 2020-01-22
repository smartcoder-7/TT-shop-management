const shell = require('shelljs')

console.log('node_env', process.env.NODE_ENV)
console.log('firebase', process.env.FIREBASE_API_KEY)

shell.exec(`
  NODE_ENV=${process.env.NODE_ENV}
  STRIPE_PUBLISHABLE_KEY=${process.env.STRIPE_PUBLISHABLE_KEY}
  FIREBASE_API_KEY=${process.env.FIREBASE_API_KEY}
  webpack
`)