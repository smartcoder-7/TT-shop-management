import React, { useState, useEffect } from 'react'
import DayPicker from 'components/DayPicker'
import RateLabel from 'components/RateLabel'
import getAllSessions from '../../../../shared/getAllSessions'

import styles from './styles.scss'
import locations from '../../../../locations'
import { getDayStartTime, formatTime } from 'shared/datetime'
import useProducts, { ProductsProvider } from '../useProducts'

const Products = () => {
  const { products } = useProducts()
  console.log(products)

  return (
    <div className={styles.products}>

    </div>
  )
}

export default () => (
  <ProductsProvider>
    <Products />
  </ProductsProvider>
)
