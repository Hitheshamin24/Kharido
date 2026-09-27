import { createSlice } from '@reduxjs/toolkit'

// ─── Dummy seed data ─────────────────────────────────────────────────────────
const INITIAL_PRODUCTS = [
  {
    id: 1,
    title: 'Minimalist Ergonomic Desk Chair',
    category: 'Furniture',
    price: 189.0,
    sku: 'KHR-1092',
    status: 'Published',
    stock: 24,
    description: 'A sleek, minimalist ergonomic desk chair designed for long hours of comfortable use.',
    image: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=400&q=80',
    seller: 'OfficeEssentials',
    rating: 4.7,
    reviews: 128,
  },
  {
    id: 2,
    title: 'Anodized Aluminum Mechanical Keyboard',
    category: 'Electronics',
    price: 165.0,
    sku: 'KHR-7201',
    status: 'Published',
    stock: 57,
    description: 'Premium mechanical keyboard with anodized aluminum body and tactile switches.',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&q=80',
    seller: 'TechGear',
    rating: 4.9,
    reviews: 342,
  },
  {
    id: 3,
    title: 'Wireless Noise-Cancelling Headphones',
    category: 'Electronics',
    price: 199.0,
    sku: 'KHR-3829',
    status: 'Published',
    stock: 33,
    description: 'Over-ear headphones with industry-leading noise cancellation and 30-hour battery life.',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80',
    seller: 'AudioPro',
    rating: 4.8,
    reviews: 215,
  },
  {
    id: 4,
    title: 'Handcrafted Leather Wallet',
    category: 'Accessories',
    price: 79.0,
    sku: 'KHR-4412',
    status: 'Published',
    stock: 80,
    description: 'Full-grain leather bifold wallet with RFID-blocking lining and 8-card slots.',
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&q=80',
    seller: 'LeatherCraft',
    rating: 4.5,
    reviews: 88,
  },
  {
    id: 5,
    title: 'Adjustable Standing Desk',
    category: 'Furniture',
    price: 399.0,
    sku: 'KHR-5501',
    status: 'Unpublished',
    stock: 12,
    description: 'Electric height-adjustable standing desk with memory presets and anti-collision technology.',
    image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=400&q=80',
    seller: 'OfficeEssentials',
    rating: 4.6,
    reviews: 74,
  },
  {
    id: 6,
    title: 'Bamboo Desk Organizer Set',
    category: 'Furniture',
    price: 49.0,
    sku: 'KHR-6630',
    status: 'Published',
    stock: 100,
    description: 'Eco-friendly bamboo desk organizer set with pen holder, file stand, and phone dock.',
    image: 'https://images.unsplash.com/photo-1493770348161-369560ae357d?w=400&q=80',
    seller: 'EcoDesk',
    rating: 4.3,
    reviews: 56,
  },
]

// ─── Slice ────────────────────────────────────────────────────────────────────
const productsSlice = createSlice({
  name: 'products',
  initialState: {
    items: INITIAL_PRODUCTS,
    loading: false,
    error: null,
  },
  reducers: {
    // Add a new product
    addProduct: (state, action) => {
      const newProduct = {
        ...action.payload,
        id: Date.now(),
        rating: 0,
        reviews: 0,
        seller: 'Me',
      }
      state.items.unshift(newProduct)
    },

    // Update an existing product by id
    updateProduct: (state, action) => {
      const index = state.items.findIndex((p) => p.id === action.payload.id)
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...action.payload }
      }
    },

    // Delete a product by id
    deleteProduct: (state, action) => {
      state.items = state.items.filter((p) => p.id !== action.payload)
    },

    // Toggle Published ↔ Unpublished
    toggleStatus: (state, action) => {
      const product = state.items.find((p) => p.id === action.payload)
      if (product) {
        product.status = product.status === 'Published' ? 'Unpublished' : 'Published'
      }
    },

    setLoading: (state, action) => { state.loading = action.payload },
    setError:   (state, action) => { state.error = action.payload },
  },
})

export const { addProduct, updateProduct, deleteProduct, toggleStatus, setLoading, setError } =
  productsSlice.actions

// ─── Selectors ────────────────────────────────────────────────────────────────
export const selectAllProducts       = (state) => state.products.items
export const selectPublishedProducts = (state) => state.products.items.filter((p) => p.status === 'Published')
export const selectProductById       = (id)    => (state) => state.products.items.find((p) => p.id === id)
export const selectProductsLoading   = (state) => state.products.loading
export const selectProductsError     = (state) => state.products.error

export default productsSlice.reducer
