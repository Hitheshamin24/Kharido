import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: [],
  totalQuantity: 0,
  totalPrice: 0,
  isCartOpen: false
}

const calculateTotals = (items) => {
  return items.reduce((acc, item) => {
    acc.totalQuantity += item.quantity;
    acc.totalPrice += (item.price * item.quantity);
    return acc;
  }, { totalQuantity: 0, totalPrice: 0 });
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    openCart: (state) => { state.isCartOpen = true },
    closeCart: (state) => { state.isCartOpen = false },
    toggleCart: (state) => { state.isCartOpen = !state.isCartOpen },
    
    setCartItems: (state, action) => {
      state.items = action.payload;
      const totals = calculateTotals(state.items);
      state.totalQuantity = totals.totalQuantity;
      state.totalPrice = totals.totalPrice;
    },

    addToCart: (state, action) => {
      const { product, size, quantity = 1 } = action.payload;
      
      const productId = product._id || product.id;
      const itemId = `${productId}-${size || 'nosize'}`;
      
      const existingItem = state.items.find(item => item.itemId === itemId);
      
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({
          itemId,
          productId,
          title: product.title,
          price: product.price,
          image: product.images && product.images.length > 0 ? product.images[0] : '',
          seller: product.seller,
          size,
          quantity
        });
      }
      
      const totals = calculateTotals(state.items);
      state.totalQuantity = totals.totalQuantity;
      state.totalPrice = totals.totalPrice;
    },
    
    removeFromCart: (state, action) => {
      const itemId = action.payload;
      state.items = state.items.filter(item => item.itemId !== itemId);
      
      const totals = calculateTotals(state.items);
      state.totalQuantity = totals.totalQuantity;
      state.totalPrice = totals.totalPrice;
    },
    
    updateQuantity: (state, action) => {
      const { itemId, amount } = action.payload;
      const existingItem = state.items.find(item => item.itemId === itemId);
      
      if (existingItem && amount > 0) {
        existingItem.quantity = amount;
      }
      
      const totals = calculateTotals(state.items);
      state.totalQuantity = totals.totalQuantity;
      state.totalPrice = totals.totalPrice;
    },
    
    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      state.totalPrice = 0;
    }
  }
})

export const { addToCart, removeFromCart, updateQuantity, clearCart, openCart, closeCart, toggleCart, setCartItems } = cartSlice.actions

export const selectCartItems = (state) => state.cart.items
export const selectCartTotalQuantity = (state) => state.cart.totalQuantity
export const selectCartTotalPrice = (state) => state.cart.totalPrice
export const selectIsCartOpen = (state) => state.cart.isCartOpen

export default cartSlice.reducer
