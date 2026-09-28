import { Link, useNavigate } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { logout, selectRole, selectUser } from '../features/auth/state/authSlice'
import { selectCartTotalQuantity, toggleCart, clearCart } from '../features/cart/state/cartSlice'
import { useApiAuth } from '../features/auth/api/authApi'
import { toast } from 'react-toastify'

const KharidoLogo = () => (
  <Link to="/" className="flex items-center gap-2">
    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
      <span className="text-white font-bold text-sm">K</span>
    </div>
    <span className="font-bold text-slate-800 text-base">Kharido</span>
    <span className="text-blue-600 font-bold text-lg leading-none">·</span>
  </Link>
)

// Public navbar
export const PublicNavbar = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector(selectUser)
  const role = useSelector(selectRole)
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)
  const cartQuantity = useSelector(selectCartTotalQuantity)
  const { logoutUser } = useApiAuth()

  const handleLogout = async () => {
    try { await logoutUser() } catch (e) {
      console.log(e.message)
    }
    dispatch(logout())
    dispatch(clearCart())
    toast.success("Logged out successfully")
    navigate('/products', { replace: true })
  }

  return (
    <nav className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <KharidoLogo />
        <Link to="/products" className="text-slate-700 font-medium text-sm hover:text-blue-600 transition-colors">
          Products
        </Link>
        {isAuthenticated && role == 'seller' &&
          <Link to="/seller/products" className="text-slate-700 font-medium text-sm hover:text-blue-600 transition-colors">
            My Products
          </Link>
        }

      </div>
      <div className="flex items-center gap-3">
        <button onClick={() => dispatch(toggleCart())} className="relative p-2 text-slate-600 hover:text-blue-600 transition-colors mr-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
          </svg>
          {cartQuantity > 0 && (
            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-blue-600 rounded-full shadow-sm border-2 border-white">
              {cartQuantity}
            </span>
          )}
        </button>
        {isAuthenticated && user ? (
          <>
            <span className="text-slate-700 font-medium text-sm px-2">
              Hello, {user.name}
            </span>
            <button onClick={handleLogout} className="text-slate-700 font-medium text-sm hover:text-red-600 transition-colors">
              Logout
            </button>
            <button className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center hover:bg-blue-200 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-blue-600">
                <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
              </svg>
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-blue-600 font-medium text-sm hover:underline">Login</Link>
            <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
              Register
            </Link>
            <button className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-slate-600">
                <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
              </svg>
            </button>
          </>
        )}
      </div>
    </nav>
  )
}

// Seller navbar
export const SellerNavbar = ({ onLogout }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector(selectUser)
  const { logoutUser } = useApiAuth()
  const handleLogout = async () => {
    dispatch(logout())
    dispatch(clearCart())
    await logoutUser()
    if (onLogout) onLogout()
    toast.success("Logged out successfully")
    navigate('/products', { replace: true })
  }

  return (
    <nav className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <KharidoLogo />
        <Link to="/seller/products" className="text-slate-700 font-medium text-sm hover:text-blue-600 transition-colors">
          My Products
        </Link>
        <Link to="/seller/products/new" className="text-slate-700 font-medium text-sm hover:text-blue-600 transition-colors">
          + Add Product
        </Link>
        <Link to="/products/" className="text-slate-700 font-medium text-sm hover:text-blue-600 transition-colors">
          All Product
        </Link>
      </div>
      <div className="flex items-center gap-3">

        {user && <span className="text-sm text-slate-600  px-3 py-1.5 rounded-lg font-medium">
          {user.name}
        </span>}
        <span className="text-sm text-slate-600 border border-slate-200 px-3 py-1.5 rounded-lg font-medium">
          Seller Account
        </span>
        <button onClick={handleLogout} className="text-slate-700 font-medium text-sm hover:text-red-600 transition-colors">
          Logout
        </button>
        <button
          className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center hover:bg-blue-700 transition-colors"
          title={user?.name}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white">
            <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </nav>
  )
}
