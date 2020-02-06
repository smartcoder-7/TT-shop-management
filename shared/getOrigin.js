let origin = 'https://pingpod.com'
if (process.env.IS_STAGING) origin = 'https://app-staging.pingpod.com'
if (process.env.IS_DEV) origin = 'http://localhost:8000'

module.exports = origin