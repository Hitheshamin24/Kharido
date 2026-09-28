import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/state/authSlice'
import productsReducer from '../features/products/state/productsSlice'
import cartReducer from '../features/cart/state/cartSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productsReducer,
    cart: cartReducer,
  },
})

export default store
