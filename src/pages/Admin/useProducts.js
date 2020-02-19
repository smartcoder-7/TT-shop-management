import React, { useContext } from 'react'
import { searchProducts } from 'api'

const POLL_INTERVAL = 10000

const ProductsContext = React.createContext({
  products: [],
  productsById: {},
  updateProducts: () => { }
});

export class ProductsProvider extends React.Component {
  state = {
    updating: false,
    queued: false,
    products: []
  }

  componentWillMount() {
    this.updateProducts()
    // const poll = () => this.updateProducts(false)
    // this.interval = setInterval(poll, POLL_INTERVAL)
  }

  componentWillUnmount() {
    this.umounted = true
    clearInterval(this.interval)
  }

  updateProducts = (queue = true) => {
    if (this.unmounted) return
    if (this.updating) {
      if (queue) this.setState({ queued: true })
      return
    }

    this.setState({ updating: true })

    return searchProducts()
      .then(products => {
        console.log('found', products)
        if (this.unmounted) return
        this.setState({ updating: false, products })
        if (this.state.queued) {
          this.setState({ queued: false })
          this.updateProducts(false)
        }
        return products
      })
  }

  render() {
    const { products } = this.state

    const productsById = {}
    products.forEach(product => {
      productsById[product.id] = product
    })

    return (
      <ProductsContext.Provider value={{ updateProducts: this.updateProducts, products, productsById }}>
        {this.props.children}
      </ProductsContext.Provider>
    )
  }
}

const useProducts = () => useContext(ProductsContext);

export default useProducts