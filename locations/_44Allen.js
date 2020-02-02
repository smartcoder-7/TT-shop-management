module.exports = {
  id: '44-allen',
  "displayName": "44 Allen",
  active: false,
  // "lockId": "12819",
  "timezone": "America/New_York",
  "tables": [
    {
      "id": "1",
      "isPremium": true
    },
    {
      "id": "2",
      "isPremium": false
    }
  ],
  "closedFrom": {
    "hour": 2,
    "minute": 0
  },
  "closedUntil": {
    "hour": 6,
    "minute": 0
  },
  "defaultRate": {
    "MEMBER": 15,
    "NON_MEMBER": 30
  },
  "specialRates": [
    {
      "id": "OFF_PEAK",
      "displayName": "Off Peak",
      "MEMBER": 0,
      "NON_MEMBER": 20,
      "ranges": [
        {
          "days": [
            0,
            6
          ],
          "from": {
            "hour": 0
          },
          "to": {
            "hour": 7
          }
        },
        {
          "days": [
            1,
            2,
            3,
            4,
            5
          ],
          "from": {
            "hour": 0
          },
          "to": {
            "hour": 7
          }
        }
      ]
    },
    {
      "id": "PEAK",
      "displayName": "Peak",
      "MEMBER": 25,
      "NON_MEMBER": 40,
      "ranges": [
        {
          "days": [
            0,
            6
          ],
          "from": {
            "hour": 10
          },
          "to": {
            "hour": 24
          }
        },
        {
          "days": [
            1,
            2,
            3,
            4,
            5
          ],
          "from": {
            "hour": 11
          },
          "to": {
            "hour": 13
          }
        },
        {
          "days": [
            1,
            2,
            3,
            4,
            5
          ],
          "from": {
            "hour": 17
          },
          "to": {
            "hour": 24
          }
        }
      ]
    }
  ]
}