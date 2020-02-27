const MIN_10 = 1000 * 60 * 10

const getBillingThreshold = (time) => {
  return Date.now() + MIN_10
}

module.exports = getBillingThreshold