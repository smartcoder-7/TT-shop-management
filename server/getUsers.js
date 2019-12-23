const { db } = require('./util/firebase')

const getUsers = async (req, res) => {
  let usersRef
  const users = []

  try {
    usersRef = db.collection('users')
    const res = await usersRef.get()
    res.docs.forEach(doc => {
      users.push(doc.data())
    })
  } catch (err) {
    res.status(500).send('Cannot reach server.')
    return
  }

  console.log(users)

  // let userData = {}

  // if (user.exists) {
  //   userData = user.data()
  // }

  res.status(200).json(users)
}

module.exports = getUsers
