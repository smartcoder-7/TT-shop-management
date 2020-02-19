const Kisi = require("kisi-client").default

const kisiClient = new Kisi()

const authenticate = async () => {
  await kisiClient.signIn(process.env.KISI_USERNAME, process.env.KISI_PASSWORD)
}

const kisi = {
  unlock: async ({ lockId }) => {
    await authenticate()

    return kisiClient
      .post(`/locks/${lockId}/unlock`, {})
  }
}

module.exports = kisi