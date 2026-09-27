import { BrowserRouter, Routes, Route, Navigate } from 'react-router'
import ProtectedRoute from './components/ProtectedRoute'

// ── Auth feature ──────────────────────────────────────────────────────────────
import LoginPage    from './features/auth/ui/LoginPage'
import RegisterPage from './features/auth/ui/RegisterPage'

// ── Products feature ──────────────────────────────────────────────────────────
import ProductsPage         from './features/products/ui/ProductsPage'
import SellerDashboardPage  from './features/products/ui/SellerDashboardPage'
import AddProductPage       from './features/products/ui/AddProductPage'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* ── Public auth routes ───────────────────────────────── */}
        <Route path="/login"    element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* ── Customer-only ────────────────────────────────────── */}
        <Route
          path="/products"
          element={
            <ProtectedRoute requiredRole="customer">
              <ProductsPage />
            </ProtectedRoute>
          }
        />

        {/* ── Seller-only ──────────────────────────────────────── */}
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