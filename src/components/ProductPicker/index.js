import React, { useState, useEffect } from 'react'
import styles from './styles.scss'
import { searchProducts } from 'api'
import { createPurchases } from '../../api';

const ProductPicker = ({
  locationId = '40-allen',
  userId,
  onChange = () => { },
  onPurchase = () => { }
}) => {
  const [selections, setSelections] = useState({})
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    searchProducts()
      .then((products) => {
        const locationProducts = products.filter(p =>
          (p.locations || []).find(l => l.value === locationId)
        )
        setProducts(locationProducts)
        setLoading(false)
      })
  }, [locationId])

  useEffect(() => {
    onChange(selections)
  }, [selections])

  const productsBySku = {}
  products.forEach(p => productsBySku[p.sku] = p)

  const purchases = []
  let sum = 0
  Object.keys(selections).forEach(sku => {
    const num = selections[sku]
    const price = productsBySku[sku].price
    const sub = num * price
    sum += sub
    purchases.push({
      userId,
      locationId,
      amount: sub * 100,
      description: `${productsBySku[sku].title} x ${num}`
    })
  })


  const purchase = (product) => {
    setProcessing(true)
    createPurchases({
      purchases
    })
      .then(() => {
        setProcessing(false)
        setSuccess(true)
        setTimeout(() => {
          onPurchase()
          setSuccess(false)
        }, 1000)
      })
  }

  const subtract = (product) => {
    const _selections = { ...selections }
    _selections[product.sku] = _selections[product.sku] || 0
    _selections[product.sku] = Math.max(0, _selections[product.sku] - 1)
    setSelections(_selections)
  }

  const add = (product) => {
    const _selections = { ...selections }
    _selections[product.sku] = _selections[product.sku] || 0
    _selections[product.sku] += 1
    setSelections(_selections)
  }

  if (loading) return (
    <div className={styles.products}>
      <p data-label>Loading...</p>
    </div>
  )

  return (
    <div className={styles.products}>
      {products.map(p => {
        const count = selections[p.sku] || 0
        return (
          <div className={styles.product} key={p.sku}>
            {count > 0 && <button className={styles.subtract} data-mini onClick={() => subtract(p)}>-</button>}
            <label className={styles.count}>{count}</label>
            <div className={styles.info}>
              <p data-p3>{p.title}</p>
              <p data-label>{p.subtitle}</p>
            </div>
            <button className={styles.add} data-mini onClick={() => add(p)}>+ Add</button>
          </div>
        )
      })}

      <br />

      {!processing && !success && sum > 0 && <button onClick={purchase}>
        Complete Purchase (${sum.toFixed(2)})
      </button>}

      {processing && <button disabled>
        Processing...
      </button>}

      {success && <button className={styles.success} disabled>
        Success!
      </button>}
    </div>
  )
}

export default ProductPicker
