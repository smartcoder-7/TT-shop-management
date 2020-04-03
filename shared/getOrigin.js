let origin = process.env.origin;
if (process.env.IS_STAGING) origin = process.env.stage;
if (process.env.IS_DEV) origin = 'http://localhost:8000';

module.exports = origin;
