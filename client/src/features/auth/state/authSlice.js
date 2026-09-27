import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: null,
  role: null, // 'customer' | 'seller'
  isAuthenticated: false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload.user
      state.role = action.payload.role
      state.isAuthenticated = true
    },
    logout: (state) => {
      state.user = null
      state.role = null
      state.isAuthenticated = false
    },
  },
})

export const { login, logout } = authSlice.actions

// Selectors
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated
export const selectRole = (state) => state.auth.role
export const selectUser = (state) => state.auth.user

export default authSlice.reducer
