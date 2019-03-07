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
    //products:storeProducts,
    products:[],
    detailProduct:detailProduct,
    cart:[],
    modalOpen:false,
    modalProduct:detailProduct,
    cartSubTotal:0,
    cartTax:0,
    cartTotal:0,
  }

  componentDidMount(){
    this.setProducts(); 
  }
  //To prevent error and get fresh data without affecting to data.js
  //Not referencing to store products just coping the values
  setProducts =()=>{
    let tempProducts =[];
    storeProducts.forEach(item =>{
      const singleItem = {...item}; 
      tempProducts = [...tempProducts,singleItem]
      
    })

    this.setState(()=>{
      return {products:tempProducts}
    }
        
    )
  }

  getItem =(id) =>{
    const product = this.state.products.find(item => item.id === id);
    return product;
  }

  handleDetail=(id)=>{
    const product = this.getItem(id);
    this.setState(()=>{
      return {detailProduct:product}
    })
  }
  addToCart=id=>{
    // console.log(`hello from AddToCart id is ${id}`)
    let tempProduct = [...this.state.products];
    const index = tempProduct.indexOf(this.getItem(id))
    const product = tempProduct[index];
    product.inCart = true;
    product.count = 1;
    const price = product.price;
    product.total = price;

    this.setState(() =>{
      return {products:tempProduct,cart:[...this.state.cart,product]}
    },()=>{
      this.addTotals();
    })

     
  }

  openModal = id =>{
    const product = this.getItem(id);
    this.setState(()=>{
      return {modalProduct:product,modalOpen:true}
    })
  }

  closeModal = () => {
    this.setState(() => {
      return {modalOpen:false}
    })
  }

  increment = (id) =>{
    let tempCart= [...this.state.cart];
    const selectedProduct = tempCart.find(item=>item.id === id);
    const index = tempCart.indexOf(selectedProduct);
    const product = tempCart[index];

    product.count = product.count+1;
    product.total = product.count * product.price;

    this.setState(() =>{
      return{cart:[...tempCart]}
    },()=>{
      this.addTotals()
    })
  }

  decrement = (id) =>{
    let tempCart= [...this.state.cart];
    const selectedProduct = tempCart.find(item=>item.id === id);
    const index = tempCart.indexOf(selectedProduct);
    const product = tempCart[index];

    product.count = product.count-1;
    if(product.count === 0){
      this.removeItem(id)
    }
    else{
      product.total = product.count * product.price;
    }


    this.setState(() =>{
      return{cart:[...tempCart]}
    },()=>{
      this.addTotals()
    })
  }

  removeItem =(id) =>{
    let tempProducts = [...this.state.products];
    let tempCart = [...this.state.cart];
    tempCart = tempCart.filter(item => item.id !== id)
    const index = tempProducts.indexOf(this.getItem(id))
    let removedProduct =tempProducts[index];
    removedProduct.inCart =false;
    removedProduct.count = 0;
    removedProduct.total =0;
    this.setState(()=>{
      return{
        cart:[...tempCart],
        products:[...tempProducts]
      }
    },
    () => {
      this.addTotals();
    }
    )
  }

  clearCart =() => {
    this.setState(()=>{
      return {cart:[]}
    },()=>{
      //get fresh products when call back
      this.setProducts();
      //update total
      this.addTotals();
    })
  }

  addTotals = () =>{
    let subTotal = 0;
    this.state.cart.map(item =>(subTotal += item.total))
    const tempTax = subTotal *0.1;
    const tax = parseFloat(tempTax.toFixed(2));
    const total = subTotal+tax;

    this.setState(()=>{
      return {
        cartSubTotal:subTotal,
        cartTax:tax,
        cartTotal:total
      }
    })
    
  }

  render() {
    return (
      <ProductContext.Provider value={{
        ...this.state,
        handleDetail:this.handleDetail,
        addToCart:this.addToCart,
        openModal:this.openModal,
        closeModal:this.closeModal,
        increment:this.increment,
        decrement:this.decrement,
        removeItem:this.removeItem,
        clearCart:this.clearCart
      }}>
          
          {this.props.children}
      </ProductContext.Provider>
    )
  }
}


const ProductConsumer = ProductContext.Consumer;

export {ProductProvider,ProductConsumer}