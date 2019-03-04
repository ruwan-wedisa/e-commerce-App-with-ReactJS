import React, { Component } from 'react'
//import data
import {storeProducts,detailProduct} from './data'

// context api comes from react to
// Do things like add post delete etc

//context object
const ProductContext = React.createContext();
//Provider component-provide info

//Consumer component-consumer info
//No need to parse in props

class ProductProvider extends Component {
  state={
    products:storeProducts,
    detailProduct:detailProduct
  }

  handleDetail=()=>{
    console.log('hello from detail')
  }
  addToCart=()=>{
    console.log('hello from AddToCart')
  }
  render() {
    return (
      <ProductContext.Provider value={{
        ...this.state,
        handleDetail:this.handleDetail,
        addToCart:this.addToCart
      }}>
          
          {this.props.children}
      </ProductContext.Provider>
    )
  }
}


const ProductConsumer = ProductContext.Consumer;

export {ProductProvider,ProductConsumer}