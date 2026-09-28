import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import { toast } from 'react-toastify'
import { PublicNavbar } from '../../../components/Navbar'
import { useProducts } from '../hooks/useProducts'
import { selectCartItems } from '../../cart/state/cartSlice'
import { selectIsAuthenticated } from '../../auth/state/authSlice'
import { useCart } from '../../cart/hooks/useCart'

const ProductDetailsPage = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { fetchById } = useProducts()
  const cartItems = useSelector(selectCartItems)
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const navigate = useNavigate()
  const cart = useCart()
  
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeImage, setActiveImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState(null)

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true)
        const data = await fetchById(id)
        setProduct(data)
        if (data && data.sizes && data.sizes.length > 0) {
          const itemInCart = cartItems.find(item => item.productId === (data._id || data.id));
          if (itemInCart && itemInCart.size) {
            setSelectedSize(itemInCart.size);
          } else {
            // Select first available size
            const available = data.sizes.find(s => s.stock > 0)
            if (available) setSelectedSize(available.size)
          }
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadProduct()
  }, [id]) 
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <PublicNavbar />
        <div className="flex items-center justify-center py-32">
          <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
          </svg>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-50">
        <PublicNavbar />
        <div className="text-center py-32">
          <h2 className="text-2xl font-bold text-slate-800">Product not found</h2>
          <Link to="/products" className="text-blue-600 hover:underline mt-4 inline-block">Back to shopping</Link>
        </div>
      </div>
    )
  }

  const inStockSizes = product.sizes?.filter(s => s.stock > 0) || []
  const currentSizeObj = product.sizes?.find(s => s.size === selectedSize)
  
  const productId = product._id || product.id
  const itemId = `${productId}-${selectedSize || 'nosize'}`
  
  // We check if this specific size is in the cart, OR if they added it from the grid without a size previously
  const isInCart = cartItems.some(item => item.itemId === itemId || item.itemId === `${productId}-nosize`)

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <PublicNavbar />

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8">
          <Link to="/products" className="hover:text-blue-600 transition-colors">Products</Link>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
          </svg>
          <span className="text-slate-800 font-medium truncate max-w-xs">{product.title}</span>
        </nav>

        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col md:flex-row">
          
          {/* Images Section */}
          <div className="w-full md:w-1/2 p-6 md:p-8 bg-slate-50 border-b md:border-b-0 md:border-r border-slate-200">
            <div className="aspect-square rounded-xl overflow-hidden bg-white border border-slate-200 mb-4">
              <img
                src={product.images && product.images.length > 0 ? product.images[activeImage] : `https://placehold.co/600x600/e2e8f0/94a3b8?text=${encodeURIComponent(product.title)}`}
                alt={product.title}
                className="w-full h-full object-cover transition-opacity duration-300"
              />
            </div>
            
            {product.images && product.images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${activeImage === idx ? 'border-blue-600 ring-2 ring-blue-100 ring-offset-1' : 'border-slate-200 hover:border-slate-300'}`}
                  >
                    <img src={img} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details Section */}
          <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col">
            <h1 className="text-3xl font-bold text-slate-900 leading-tight mb-3">
              {product.title}
            </h1>
            
            <div className="flex items-center gap-4 mb-6">
              <span className="text-2xl font-extrabold text-blue-600">₹{product.price?.toFixed(2)}</span>
            </div>

            <div className="mb-8">
              <h3 className="text-sm font-semibold text-slate-900 mb-2">Description</h3>
              <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">
                {product.description}
              </p>
            </div>

            {/* Sizes */}
            {inStockSizes.length > 0 ? (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-slate-900">Available Sizes</h3>
                  {currentSizeObj && (
                    <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                      {currentSizeObj.stock} in stock
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {inStockSizes.map((s) => (
                    <button
                      key={s.size}
                      onClick={() => setSelectedSize(s.size)}
                      className={`px-4 py-2 text-sm font-medium rounded-lg border transition-all ${
                        selectedSize === s.size
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : 'border-slate-200 text-slate-700 hover:border-blue-300 hover:bg-slate-50'
                      }`}
                    >
                      {s.size}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-lg">
                <p className="text-red-600 text-sm font-medium">Currently out of stock.</p>
              </div>
            )}

            <div className="mt-auto pt-6 border-t border-slate-100 flex gap-4">
              <button
                onClick={() => {
                  if (!isAuthenticated) {
                    toast.error("Please login to add items to your cart");
                    navigate("/login");
                    return;
                  }
                  if (!isInCart) cart.add({ product, size: selectedSize, quantity: 1 })
                  cart.open()
                }}
                disabled={inStockSizes.length === 0}
                className={`flex-1 font-semibold py-3.5 rounded-xl shadow-sm transition-all text-white flex items-center justify-center gap-2 ${
                  isInCart
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600'
                }`}
              >
                {isInCart ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                    Added to Cart
                  </>
                ) : (
                  'Add to Cart'
                )}
              </button>
            </div>
            
            <p className="text-xs text-slate-400 mt-4 text-center">
              Sold by Seller ID: {product.seller}
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default ProductDetailsPage
