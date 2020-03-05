module.exports = {
  id: '44-allen',
  displayName: "44 Allen",
  // active: true,
  lockId: "12926",
  timezone: "America/New_York",
  tables: [
    {
      id: "1",
      isPremium: true
    },
    {
      id: "2",
      isPremium: true
    },
  ],
  closedFrom: {
    hour: 2,
    minute: 0
  },
  closedUntil: {
    hour: 6,
    minute: 0
  },
  // inBeta: true,
  defaultRate: {
    MEMBER: 0,
    NON_MEMBER: 10
  },
  specialRates: [
    {
      id: 'PEAK',
      displayName: "Peak",
      MEMBER: 10,
      NON_MEMBER: 20,
      ranges: [
        {
          days: [
            1,
            2,
            3,
            4,
            5,
          ],
          from: {
            hour: 12
          },
          to: {
            hour: 14
          }
        },
        {
          days: [
            1,
            2,
            3,
            4,
            5,
          ],
          from: {
            hour: 17
          },
          to: {
            hour: 24
          }
        },
        {
          days: [
            0,
            6,
          ],
          from: {
            hour: 0
          },
          to: {
            hour: 24
          }
        },
      ]
    },
  ]
}