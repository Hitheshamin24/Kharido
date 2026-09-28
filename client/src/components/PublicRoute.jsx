import { useSelector } from 'react-redux'
import { Navigate } from 'react-router'
import { selectIsAuthenticated, selectRole, selectUser } from '../features/auth/state/authSlice'

const PublicRoute = ({ children }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const role = useSelector(selectRole)
  const user = useSelector(selectUser)

  // If already logged in, redirect to their respective dashboard/products page
  if (isAuthenticated && user) {
    const fallback = role === 'seller' ? '/seller/products' : '/products'
    return <Navigate to={fallback} replace />
  }

  return children
}

export default PublicRoute
