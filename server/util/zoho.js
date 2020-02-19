const axios = require('axios')

const v = {
  refresh_token: "1000.9d95bc35414a8ce8c8104847882ffd5e.076ba68b9e26fe1fab876784ec1fb128",
  client_id: "1000.ZT90QURB023B2Q4DZQ5XFMACACW0TH",
  client_secret: "f05bc1a0f182740597c2af0ead4c4c467e2a65ce39",
  redirect_uri: "http://www.zoho.com/invoice",
  grant_type: "refresh_token"
}

/*
  curl -X POST -H "Content-Type: application/x-www-form-urlencoded" 'https://accounts.zoho.com/oauth/v2/token?code=1000.0b849d0634235162c759b33f0be96df4.60d67977a692fdbfd60085043984668a&client_id=1000.ZT90QURB023B2Q4DZQ5XFMACACW0TH&client_secret=f05bc1a0f182740597c2af0ead4c4c467e2a65ce39&redirect_uri=http://www.zoho.com/invoice&grant_type=authorization_code'
*/

class Zoho {
  constructor() {
    this.oauth()
  }

  oauth() {
    const now = Date.now()

    const shouldRefetch = !this.access_token || (this.access_token && now >= this.expiry)

    if (!shouldRefetch) return Promise.resolve()

    this.access_token = null

    return axios({
      method: "POST",
      url: `https://accounts.zoho.com/oauth/v2/token?refresh_token=${v.refresh_token}&client_id=${v.client_id}&client_secret=${v.client_secret}&redirect_uri=${v.redirect_uri}&grant_type=${v.grant_type}`,
      headers: {
        'Content-Type': 'application/x-www-formurlencoded'
      }
    })
      .then(({ data }) => {
        const { access_token, expires_in } = data
        this.access_token = access_token
        this.expiry = now + expires_in
      })
  }

  async request(opts) {
    await this.oauth()

    return axios({
      headers: {
        "Authorization": `Zoho-oauthtoken ${this.access_token}`,
        "X-com-zoho-invoice-organizationid": "707271887",
        "Content-Type": "multipart/form-data"
      },
      ...opts
    })
  }

  async get(url) {
    return this.request({
      method: "GET",
      url
    }).then(({ data }) => data)
  }
}

const zoho = new Zoho()

module.exports = zoho