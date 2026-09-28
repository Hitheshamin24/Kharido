import { useSelector, useDispatch } from 'react'
import { Link, useNavigate } from 'react-router'
import { PublicNavbar } from '../../../components/Navbar'
import {
  selectCartItems,
  selectCartTotalPrice,
  selectCartTotalQuantity
} from '../state/cartSlice'
import { selectIsAuthenticated } from '../../auth/state/authSlice'
import { toast } from 'react-toastify'
import { useCart } from '../hooks/useCart'

const CartPage = () => {
  const navigate = useNavigate()
  const cart = useCart()
  
  const cartItems = useSelector(selectCartItems)
  const totalPrice = useSelector(selectCartTotalPrice)
  const totalQuantity = useSelector(selectCartTotalQuantity)
  const isAuthenticated = useSelector(selectIsAuthenticated)

  const handleQuantityChange = (itemId, productId, size, newAmount) => {
    if (newAmount < 1) return
    cart.update(itemId, productId, size, newAmount)
  }

  const handleCheckout = () => {
    if (!isAuthenticated) {
      // You could pass state here to redirect back after login
      navigate('/login')
    } else {
      toast.success("Order placed successfully! (Dummy Checkout)", {
        position: "top-right",
        autoClose: 3000,
      })
      cart.clear()
      navigate('/products')
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <PublicNavbar />

      <main className="max-w-4xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Your Cart</h1>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-slate-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">Your cart is empty</h2>
            <p className="text-slate-500 mb-6">Looks like you haven't added anything to your cart yet.</p>
            <Link to="/products" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors inline-block">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items List */}
            <div className="flex-1">
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                  <span className="text-sm font-semibold text-slate-600 uppercase tracking-wider">
                    {totalQuantity} {totalQuantity === 1 ? 'Item' : 'Items'}
                  </span>
                  <button 
                    onClick={() => {
                      if(window.confirm('Clear all items?')) cart.clear()
                    }}
                    className="text-xs font-medium text-red-500 hover:text-red-700 transition-colors"
                  >
                    Clear Cart
                  </button>
                </div>
                
                <ul className="divide-y divide-slate-100">
                  {cartItems.map((item) => (
                    <li key={item.itemId} className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 hover:bg-slate-50/50 transition-colors">
                      {/* Image */}
                      <Link to={`/products/${item.productId}`} className="shrink-0">
                        <img 
                          src={item.image || `https://placehold.co/150x150/e2e8f0/94a3b8?text=${encodeURIComponent(item.title.charAt(0))}`}
                          alt={item.title} 
                          className="w-24 h-24 sm:w-20 sm:h-20 object-cover rounded-xl border border-slate-200 bg-white"
                        />
                      </Link>
                      
                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <Link to={`/products/${item.productId}`} className="block">
                          <h3 className="font-semibold text-slate-900 text-base line-clamp-1 hover:text-blue-600 transition-colors">{item.title}</h3>
                        </Link>
                        {item.size && (
                          <p className="text-sm text-slate-500 mt-1">Size: <span className="font-medium text-slate-700">{item.size}</span></p>
                        )}
                        <p className="text-lg font-bold text-slate-900 mt-2">${item.price.toFixed(2)}</p>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex items-center gap-4 sm:gap-6 mt-4 sm:mt-0 w-full sm:w-auto justify-between sm:justify-end">
                        {/* Quantity control */}
                        <div className="flex items-center border border-slate-200 rounded-lg bg-white overflow-hidden">
                          <button 
                            onClick={() => handleQuantityChange(item.itemId, item.productId, item.size, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                          >
                            -
                          </button>
                          <span className="w-8 text-center text-sm font-medium text-slate-800">
                            {item.quantity}
                          </span>
                          <button 
                            onClick={() => handleQuantityChange(item.itemId, item.productId, item.size, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                          >
                            +
                          </button>
                        </div>
                        
                        {/* Remove */}
                        <button 
                          onClick={() => cart.remove(item.itemId, item.productId, item.size)}
                          className="text-slate-400 hover:text-red-500 p-2 transition-colors"
                          title="Remove item"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                          </svg>
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Order Summary */}
            <div className="w-full lg:w-80">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm sticky top-24">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Order Summary</h3>
                
                <div className="space-y-3 text-sm text-slate-600 mb-6 pb-6 border-b border-slate-100">
                  <div className="flex justify-between">
                    <span>Subtotal ({totalQuantity} items)</span>
                    <span className="font-medium text-slate-900">${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-green-600 font-medium">Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>Calculated at checkout</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center mb-8">
                  <span className="text-base font-bold text-slate-900">Total</span>
                  <span className="text-2xl font-extrabold text-blue-600">${totalPrice.toFixed(2)}</span>
                </div>
                
                <button 
                  onClick={handleCheckout}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-xl shadow-sm transition-all text-base"
                >
                  Proceed to Checkout
                </button>
                
                {!isAuthenticated && (
                  <p className="text-xs text-slate-500 text-center mt-4">
                    You will be asked to <Link to="/login" className="text-blue-600 hover:underline">sign in</Link> securely on the next step.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default CartPage
