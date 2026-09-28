import { BrowserRouter, Routes, Route, Navigate } from 'react-router'
import ProtectedRoute from './components/ProtectedRoute'
import PublicRoute from './components/PublicRoute'

// Auth routes
import LoginPage from './features/auth/ui/LoginPage'
import RegisterPage from './features/auth/ui/RegisterPage'

// Product routes
import ProductsPage from './features/products/ui/ProductsPage'
import ProductDetailsPage from './features/products/ui/ProductDetailsPage'
import CartDrawer from './features/cart/ui/CartDrawer'
import SellerDashboardPage from './features/products/ui/SellerDashboardPage'
import AddProductPage from './features/products/ui/AddProductPage'
import { useDispatch, useSelector } from 'react-redux'
import { login, selectAccessToken } from './features/auth/state/authSlice'
import { useEffect } from 'react'
import { useApiAuth } from './features/auth/api/authApi'
import { useCart } from './features/cart/hooks/useCart'

const App = () => {

  const accessToken = useSelector(selectAccessToken)
  const { fetchUser: fetchUserApi } = useApiAuth()
  const dispatch = useDispatch()
  const cart = useCart()
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetchUserApi()
        console.log("Current user:", response.data.data)
        dispatch(login({ user: { email: response.data.data.email, name: response.data.data.name, userId: response.data.data.id }, role: response.data.data.role }))
        cart.loadCart()
      } catch (error) {
        console.error("Failed to fetch user:", error)
      }
    }
    fetchUser()
  }, [accessToken])
  return (
    <BrowserRouter>
      <CartDrawer />
      <Routes>
        {/* Default */}
        <Route path="/" element={<Navigate to="/products" replace />} />

        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

        <Route
          path="/products"
          element={<ProductsPage />} 
        />
        <Route path="/products/:id" element={<ProductDetailsPage />} />

        {/* Seller routes */}
        <Route
          path="/seller/products"
          element={
            <ProtectedRoute requiredRole="seller">
              <SellerDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/seller/products/new"
          element={
            <ProtectedRoute requiredRole="seller">
              <AddProductPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/seller/products/:id/edit"
          element={
            <ProtectedRoute requiredRole="seller">
              <AddProductPage isEditing />
            </ProtectedRoute>
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App