import { useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router'
import { selectIsAuthenticated, selectRole } from '../features/auth/state/authSlice'

/**
 * ProtectedRoute — wraps a route that requires authentication.
 *
 * Props:
 *   children     — the component to render if access is granted
 *   requiredRole — optional: 'customer' | 'seller'
 *   redirectTo   — where to send unauthenticated users (default: '/login')
 */
const ProtectedRoute = ({ children, requiredRole, redirectTo = '/login' }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const role            = useSelector(selectRole)
  const location        = useLocation()

  // Not logged in → preserve attempted URL in location.state.from
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />
  }

  // Wrong role → redirect to their correct dashboard
  if (requiredRole && role !== requiredRole) {
    const fallback = role === 'seller' ? '/seller/products' : '/products'
    return <Navigate to={fallback} replace />
  }

  return children
}

export default ProtectedRoute
