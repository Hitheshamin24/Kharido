import { useSelector, useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router'
import { 
  selectIsCartOpen, 
  selectCartItems, 
  selectCartTotalPrice
} from '../state/cartSlice'
import { useCart } from '../hooks/useCart'
import { toast } from 'react-toastify'
import { selectIsAuthenticated } from '../../auth/state/authSlice'

const CartDrawer = () => {
  const navigate = useNavigate()
  const cart = useCart()
  
  const isOpen = useSelector(selectIsCartOpen)
  const items = useSelector(selectCartItems)
  const total = useSelector(selectCartTotalPrice)
  const isAuthenticated = useSelector(selectIsAuthenticated)

  const handleCheckout = () => {
    cart.close()
    if (!isAuthenticated) {
      navigate('/login')
    } else {
      toast.success("order placed(dummy)", {
        position: "top-right",
        autoClose: 3000,
      })
      cart.clear()
      navigate('/products')
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] transition-opacity duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={() => cart.close()}
      />

      {/* Drawer */}
      <div 
        className={`fixed inset-y-0 right-0 w-full sm:w-[400px] bg-white z-[101] shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-900">Your Cart</h2>
          <button 
            onClick={() => cart.close()}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-5">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-slate-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                </svg>
              </div>
              <p className="text-slate-500 font-medium">Your cart is empty</p>
              <button 
                onClick={() => cart.close()} 
                className="text-blue-600 font-medium mt-2 hover:underline"
              >
                Continue shopping
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {items.map(item => (
                <li key={item.itemId} className="py-4 flex gap-4">
                  <img 
                    src={item.image || `https://placehold.co/100x100/e2e8f0/94a3b8?text=${encodeURIComponent(item.title.charAt(0))}`}
                    alt={item.title} 
                    className="w-20 h-20 object-cover rounded-lg border border-slate-200 shrink-0"
                  />
                  <div className="flex-1 flex flex-col">
                    <h4 className="font-semibold text-slate-800 text-sm line-clamp-2 leading-snug">{item.title}</h4>
                    {item.size && <p className="text-xs text-slate-500 mt-1">Size: {item.size}</p>}
                    
                    <div className="flex items-center justify-between mt-auto pt-2">
                      <div className="flex items-center border border-slate-200 rounded-lg">
                        <button 
                          onClick={() => {
                            if (item.quantity > 1) cart.update(item.itemId, item.productId, item.size, item.quantity - 1)
                          }}
                          className="w-7 h-7 flex items-center justify-center text-slate-500 hover:bg-slate-100"
                        >-</button>
                        <span className="w-6 text-center text-xs font-medium">{item.quantity}</span>
                        <button 
                          onClick={() => cart.update(item.itemId, item.productId, item.size, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center text-slate-500 hover:bg-slate-100"
                        >+</button>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-slate-900">₹{(item.price * item.quantity).toFixed(2)}</span>
                        <button 
                          onClick={() => cart.remove(item.itemId, item.productId, item.size)}
                          className="text-slate-400 hover:text-red-500"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-5 border-t border-slate-100 bg-slate-50 mt-auto">
            <div className="flex items-center justify-between mb-4">
              <span className="font-semibold text-slate-600">Subtotal</span>
              <span className="text-xl font-bold text-slate-900">₹{total.toFixed(2)}</span>
            </div>
            <button 
              onClick={handleCheckout}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-xl shadow-sm transition-all"
            >
              Checkout
            </button>
          </div>
        )}
      </div>
    </>
  )
}

export default CartDrawer
