const RATES = {
  PEAK: {
    name: 'Peak',
    price: {
      MEMBER: 25,
      NON_MEMBER: 40
    }
  },
  NORMAL: {
    price: {
      MEMBER: 15,
      NON_MEMBER: 30
    }
  },
  OFF_PEAK: {
    name: 'Off Peak',
    price: {
      MEMBER: 0,
      NON_MEMBER: 20
    }
  },
}

module.exports = RATES