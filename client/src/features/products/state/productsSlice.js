import { createSlice, createSelector } from '@reduxjs/toolkit'

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    // Set all products from MongoDB
    setProducts: (state, action) => {
      state.items = action.payload
    },

    // Add a new product (already saved to DB, so payload has the real _id)
    addProduct: (state, action) => {
      state.items.unshift(action.payload)
    },

    // Update an existing product by _id
    updateProduct: (state, action) => {
      const index = state.items.findIndex((p) => p._id === action.payload._id || p.id === action.payload.id)
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...action.payload }
      }
    },

    // Delete a product by _id
    deleteProduct: (state, action) => {
      state.items = state.items.filter((p) => p._id !== action.payload && p.id !== action.payload)
    },

    // Toggle Published ↔ Unpublished
    toggleStatus: (state, action) => {
      const product = state.items.find((p) => p._id === action.payload || p.id === action.payload)
      if (product) {
        product.status = product.status === 'Published' ? 'Unpublished' : 'Published'
      }
    },

    setLoading: (state, action) => { state.loading = action.payload },
    setError:   (state, action) => { state.error = action.payload },
  },
})

export const { setProducts, addProduct, updateProduct, deleteProduct, toggleStatus, setLoading, setError } = productsSlice.actions

// Selectors
export const selectAllProducts       = (state) => state.products.items
export const selectPublishedProducts = createSelector(
  [selectAllProducts],
  (items) => items.filter((p) => p.status === 'Published')
)
export const selectProductById       = (id)    => (state) => state.products.items.find((p) => p._id === id || p.id === id)
export const selectProductsLoading   = (state) => state.products.loading
export const selectProductsError     = (state) => state.products.error

export default productsSlice.reducer
