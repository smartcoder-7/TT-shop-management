const Kisi = require("kisi-client").default
const kisiClient = new Kisi()

const authenticate = async () => {
  await kisiClient.signIn("christine@pingpod.com", "UrLr_QvNzU2Wa-PB4hgw")
}

// id: 12819,
//        name: '40 Allen',

const unlockDoor = async (id) => {
  await authenticate()

  return kisiClient
    .post(`/locks/${id}/unlock`, {})
    .then(result => console.log(result)) // the result
    .catch(error => console.log(error)) // any error
}

unlockDoor('12819')
