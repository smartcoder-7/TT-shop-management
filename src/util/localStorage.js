const ROOT_KEY = 'pingpod'
export const CART_KEY = `${ROOT_KEY}/cart`
export const LOCATION_KEY = `${ROOT_KEY}/locationId`
export const PREMIUM_KEY = `${ROOT_KEY}/premium-sessions`

export const clear = (key) => {
  return localStorage.clear(key)
}

export const setString = (key, str = '') => {
  return localStorage.setItem(key, str)
}

export const setArray = (key, arr = []) => {
  return localStorage.setItem(key, arr.join(','))
}

export const getObject = (key) => {
  let obj = {}

  try {
    const cookie = localStorage.getItem(key) || '{}'
    const storedString = cookie.trim()
    obj = JSON.parse(storedString)
  } catch (err) {
    console.warn(err)
  }

  return obj
}

export const getArray = (key) => {
  let arr = []

  try {
    const cookie = localStorage.getItem(key) || ''
    const storedString = cookie.trim()
    if (storedString) {
      arr = storedString.split(',')
    }
  } catch (err) {
    console.warn(err)
  }

  return arr
}

export const addToArray = (key, item) => {
  const items = getArray(key)

  if (items.indexOf(item) > -1) {
    return
  }

  items.push(item)
  setArray(key, items)
  return items
}

export const removeFromArray = (key, item) => {
  const items = getArray(key)
  const index = items.indexOf(item)

  if (index < 0) {
    return
  }

  items.splice(index, 1)
  setArray(key, items)
  return items
}

export const updateObject = (key, update = {}) => {
  const obj = getObject(key)

  const newObj = {
    ...obj,
    ...update
  }

  localStorage.setItem(key, JSON.stringify(newObj))
  return newObj
}

export const getString = (key) => {
  return localStorage.getItem(key) || ''
}
