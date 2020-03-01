import React, { useState, useEffect } from 'react'
import styles from './styles.scss'
import { searchProducts } from 'api'
import { createPurchases } from '../../api';

const ProductGroup = (({ title, products, selections, onProductAdd, onProductSubtract }) => {
  const [expanded, setExpanded] = useState(false)

  let selected = 0
  products.forEach(p => {
    const count = selections[p.sku] || 0
    selected += count
  })

  return (
    <div className={styles.productGroup}>
      <h3 onClick={() => setExpanded(!expanded)}>
        <span>{expanded ? '-' : '+'}</span>
        {title} {selected ? `(${selected})` : ''}
      </h3>
      {expanded && products
        .filter(p => !!p.price)
        .sort((a, b) => a.subtitle > b.subtitle ? 1 : -1)
        .map((p, i) => {
          const count = selections[p.sku] || 0
          const price = parseFloat(p.price)

          return (
            <div className={styles.product} key={i}>
              {count > 0 && <button className={styles.subtract} data-mini onClick={() => onProductSubtract(p)}>-</button>}
              <label className={styles.count}>{count}</label>
              <div className={styles.info}>
                <p data-label>{p.subtitle}</p>
                <p data-label>${price.toFixed(2)}</p>
              </div>
              <button className={styles.add} data-mini onClick={() => onProductAdd(p)}>+ Add</button>
            </div>
          )
        })}
    </div>
  )
})

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
        const locationProducts = products
          .filter(p => (p.locations || []).find(l => l.value === locationId))
          .filter(p => p.price && p.title)
        setProducts(locationProducts)
        setLoading(false)
      })
  }, [locationId])

  useEffect(() => {
    onChange(selections)
  }, [selections])

  const productsBySku = {}
  const productsByTitle = {}
  products.forEach(p => productsBySku[p.sku] = p)
  products.forEach(p => {
    productsByTitle[p.title] = productsByTitle[p.title] || []
    productsByTitle[p.title].push(p)
  })

  const purchases = []
  let sum = 0

  Object.keys(selections).forEach(sku => {
    const num = selections[sku]
    const price = productsBySku[sku].price
    const sub = num * price
    sum += sub

    if (sub <= 0) return

    purchases.push({
      userId,
      locationId,
      amount: sub * 100,
      description: `${productsBySku[sku].title} x ${num}`
    })
  })

  const purchase = () => {
    setProcessing(true)
    createPurchases({
      purchases
    })
      .then(() => {
        setProcessing(false)
        setSuccess(true)
        setTimeout(() => {
          // onPurchase()
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
      {Object.keys(productsByTitle)
        .sort()
        .map(title => (
          <ProductGroup
            key={title}
            selections={selections}
            title={title}
            products={productsByTitle[title]}
            onProductAdd={add}
            onProductSubtract={subtract}
          />
        ))}

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
