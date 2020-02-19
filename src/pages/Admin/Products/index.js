import React, { useState, useEffect } from 'react'
import DayPicker from 'components/DayPicker'
import RateLabel from 'components/RateLabel'
import getAllSessions from '../../../../shared/getAllSessions'
import { Form, Field } from 'react-final-form'

import styles from './styles.scss'
import locations from '../../../../locations'
import TextField from 'components/fields/TextField'
import NumberField from 'components/fields/NumberField'
import SelectField from 'components/fields/SelectField'
import { createProduct, updateProduct } from 'api'
import { getDayStartTime, formatTime } from 'shared/datetime'
import useProducts, { ProductsProvider } from '../useProducts'
import modalContainer from '../../../containers/modalContainer';

const ProductForm = ({ product, onSave }) => {
  const handleSubmit = (values) => {
    if (!product) {
      createProduct(values)
        .then(res => {
          onSave()
          modalContainer.close()
        })

      return
    }

    updateProduct(values)
      .then(res => {
        onSave()
        modalContainer.close()
      })
  }

  return (
    <div className={styles.editingForm}>
      <Form
        initialValues={product}
        onSubmit={handleSubmit}
        render={({ handleSubmit, values, ...rest }) => (
          <div>
            <form onSubmit={handleSubmit}>
              <div data-field-row>
                <TextField name="title" label="Title" />
              </div>

              <div data-field-row>
                <TextField name="subtitle" label="Subtitle" />
              </div>

              <div data-field-row>
                <TextField name="sku" label="Sku" />
              </div>

              <div data-field-row>
                <SelectField name="locations" label="Locations" options={Object.values(locations).map(l => ({
                  value: l.id,
                  label: l.displayName
                }))} />
              </div>

              {/* <div data-field-row>
                <SelectField name="tags" label="Tags" options={Object.values(locations).map(l => ({
                  value: l.id,
                  label: l.displayName
                }))} />
              </div> */}

              <div data-field-row>
                <NumberField name="price" label="Price" />
              </div>

              {/* {submissionError && (
                  <div className={styles.error} data-p3 data-error>
                    {submissionError.toString()}
                  </div>
                )} */}

              <button type="submit">Save</button>
            </form>
          </div>
        )}
      />
    </div>
  )
}

const edit = ({ product, onSave }) => {
  modalContainer.open({
    content: <ProductForm product={product} onSave={onSave} />
  })
}

const Product = ({ product }) => {
  const { updateProducts } = useProducts()
  const { title, subtitle, sku, price } = product
  const locations = product.locations || []

  return (
    <tr className={styles.product} onClick={() => { edit({ product, onSave: updateProducts }) }}>
      <td>{title}</td>
      <td>{subtitle}</td>
      <td>{sku}</td>
      <td>{locations.map(l => l.label).join(', ')}</td>
      <td>${(price ? parseFloat(price) : 0).toFixed(2)}</td>
    </tr>
  )
}

const Products = () => {
  const { products, updateProducts } = useProducts()

  return (
    <div className={styles.productsPage}>
      <button data-mini onClick={() => edit({ onSave: updateProducts })}>
        + Add New Product
      </button>

      <br />
      <br />

      <table className={styles.products}>
        <thead className={styles.product} data-header={true}>
          <tr className={styles.product}>
            <th>Title</th>
            <th>Subtitle</th>
            <th>SKU</th>
            <th>Locations</th>
            <th>Unit Price</th>
          </tr>
        </thead>

        <tbody>
          {products.map(p => {
            return (
              <Product
                key={p.id}
                product={p}
              />
            )
          })}
        </tbody>
      </table>
    </div >
  )
}

export default () => (
  <ProductsProvider>
    <Products />
  </ProductsProvider>
)
