module.exports = {
  id: '40-allen',
  displayName: "40 Allen",
  active: true,
  lockId: "12926",
  timezone: "America/New_York",
  tables: [
    {
      id: "1",
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
  memberOnly: true,
  defaultRate: {
    MEMBER: 10,
    NON_MEMBER: 20
  },
  specialRates: [
    {
      id: 'PEAK',
      displayName: "Peak",
      MEMBER: 20,
      NON_MEMBER: 40,
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
            hour: 18
          },
          to: {
            hour: 24
          }
        },
        {
          days: [
            6,
            7,
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