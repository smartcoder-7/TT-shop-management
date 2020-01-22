const shell = require('shelljs')

shell.exec(`
  STRIPE_PUBLISHABLE_KEY=${process.env.STRIPE_PUBLISHABLE_KEY}
  webpack
`)