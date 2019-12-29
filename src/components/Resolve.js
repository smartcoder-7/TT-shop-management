import React, { useState, useEffect } from 'react'

const Resolve = ({ promise }) => {
  const [result, setResult] = useState()

  const resolve = (p, result) => {
    if (p !== promise) return console.log('stale!')
    console.log(result)
    setResult(result)
  }

  useEffect(() => {
    promise()
      .then((result) => {
        resolve(promise, result)
      })
  }, [promise])

  return result
}
