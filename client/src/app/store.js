import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/state/authSlice'
import productsReducer from '../features/products/state/productsSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productsReducer,
  },
})

export default store
