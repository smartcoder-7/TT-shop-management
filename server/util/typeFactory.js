const uuid = require('uuid')
const { db } = require('./firebase')
const authenticate = require('./authenticate')

const op = d => d

const typeFactory = (type, { beforeCreate = op, beforeUpdate = op }) => {
  const create = async (_data) => {
    const data = await beforeCreate(_data)
    const id = data.id || uuid()
    const ref = db.collection(type).doc(id)
    await ref.update(data)
    return data
  }

  const createMultiple = async (_data) => {
    const data = _data[type]
    const results = await Promise.all(data.map(datum => create(datum)))
    return results
  }

  const get = async (id) => {
    const ref = db.collection(type).doc(id)
    const doc = await ref.get()

    if (!doc.exists) throw `Could not find document [${id}] in ${type}.`
    return doc.data()
  }

  const getMultiple = async (_data) => {
    const data = _data[type]
    const results = await Promise.all(data.map(datum => get(datum)))
    return results
  }

  const search = async (_data) => {
    let query = db.collection(type)

    const rules = _data.rules || []
    rules.forEach(rule => {
      query = query.where(rule[0], rule[1], rule[2])
    })

    const results = []
    const res = await query.get()
    if (!res.docs) { return [] }

    res.docs.forEach(doc => {
      results.push(doc.data())
    })

    return results
  }

  const update = async (_data) => {
    const data = await beforeUpdate(_data)
    const { id } = data
    const ref = db.collection(type).doc(id)
    await ref.update(data)
    return data
  }

  const generateRoute = fn => authenticate(async (req, res) => {
    try {
      const response = await fn(req.body)
      res.status(200).json(response)
    } catch (err) {
      res.status(500).send(err.message)
    }
  })

  const applyRoutes = (app) => {
    app.post(`/api/${type}/create`, generateRoute(create))
    app.post(`/api/${type}/create-multiple`, generateRoute(createMultiple))
    app.post(`/api/${type}/get`, generateRoute(get))
    app.post(`/api/${type}/get-multiple`, generateRoute(getMultiple))
    app.post(`/api/${type}/update`, generateRoute(update))
    app.post(`/api/${type}/search`, generateRoute(search))
  }

  return {
    create,
    createMultiple,
    get,
    getMultiple,
    update,
    search,
    applyRoutes
  }
}



module.exports = typeFactory