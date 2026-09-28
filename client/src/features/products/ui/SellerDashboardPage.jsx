import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router'
import { useDispatch } from 'react-redux'
import { SellerNavbar } from '../../../components/Navbar'
import { logout } from '../../auth/state/authSlice'
import { clearCart } from '../../cart/state/cartSlice'
import { useProducts } from '../hooks/useProducts'
import { useApiAuth } from '../../auth/api/authApi'

// Stat card
const StatCard = ({ label, value, icon }) => (
  <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center justify-between">
    <div>
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
      <p className="text-3xl font-bold text-slate-900">{value}</p>
    </div>
    <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-slate-500">
      {icon}
    </div>
  </div>
)

// Seller dashboard page
const SellerDashboardPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { logoutUser } = useApiAuth()

  const productsHook = useProducts()

  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 500)
    return () => clearTimeout(timer)
  }, [searchQuery])

  useEffect(() => {
    productsHook.fetchSellerProducts({ search: debouncedSearch, page: 1, limit: 50 })
  }, [debouncedSearch])

  const products = productsHook.all || []

  const avgPrice = products.length > 0
    ? products.reduce((sum, p) => sum + (p.price || 0), 0) / products.length
    : 0

  const totalStock = products.reduce((total, p) => {
    const pStock = p.sizes ? p.sizes.reduce((sum, s) => sum + (s.stock || 0), 0) : 0
    return total + pStock
  }, 0)

  const handleDelete = async (id) => {
    if (window.confirm('Delete this product permanently?')) {
      try {
        await productsHook.remove(id)
      } catch (err) {
        console.log(err)
        if (err?.response?.data?.message === "refreshToken mismatch" || err?.message === "refreshToken mismatch") {
          handleLogout()
        } else {
          alert("Failed to delete product")
        }
      }
    }
  }

  const handleLogout = () => {
    dispatch(logout())
    dispatch(clearCart())
    logoutUser()
    navigate('/products', { replace: true })
  }

  // Search filtering is now done on the server, but we can keep calculating stats based on the fetched products.
  const filtered = products

  const STAT_CARDS = [
    {
      label: 'Total Catalog', value: products.length,
      icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" /></svg>,
    },
    {
      label: 'Total Inventory Units', value: totalStock,
      icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016 2.993 2.993 0 0 0 2.25-1.016 3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" /></svg>,
    },
    {
      label: 'Avg. Price Point', value: `₹${avgPrice.toFixed(2)}`,
      icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" /></svg>,
    },
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      <SellerNavbar onLogout={handleLogout} />

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Seller Product Management</h1>
            <p className="text-slate-500 text-sm mt-1">
              Manage your inventory and pricing on Kharido
            </p>
          </div>
          <Link
            to="/seller/products/new"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors flex items-center gap-2"
          >
            <span className="text-lg leading-none">+</span>
            Add Product
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {STAT_CARDS.map(({ label, value, icon }) => (
            <StatCard key={label} label={label} value={value} icon={icon} />
          ))}
        </div>

        {/* Table Card */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          {/* Search */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-4">
            <div className="relative w-full max-w-sm">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title..."
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 outline-none focus:border-blue-400 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto min-h-[200px]">
            {productsHook.isLoading ? (
              <div className="flex justify-center py-16">
                <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50">
                    {['Product', 'Total Stock', 'Price', 'Actions'].map((h) => (
                      <th
                        key={h}
                        className={`py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider ${h === 'Actions' ? 'text-right' : 'text-left'}`}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((product) => {
                    const pStock = product.sizes ? product.sizes.reduce((sum, s) => sum + (s.stock || 0), 0) : 0
                    const imageUrl = product.images && product.images.length > 0 ? product.images[0] : ''

                    return (
                      <tr key={product._id || product.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                        {/* Product */}
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={imageUrl}
                              alt={product.title}
                              className="w-10 h-10 rounded-lg object-cover bg-slate-100 shrink-0"
                              onError={(e) => { e.target.src = `https://placehold.co/40x40/e2e8f0/94a3b8?text=${encodeURIComponent(product.title.charAt(0))}` }}
                            />
                            <div>
                              <p className="text-sm font-semibold text-slate-800 line-clamp-1">{product.title}</p>
                              <p className="text-xs text-slate-400">ID: {product._id || product.id}</p>
                            </div>
                          </div>
                        </td>

                        {/* Stock */}
                        <td className="py-4 px-4">
                          <span className="text-sm text-slate-600 font-medium">{pStock} units</span>
                        </td>

                        {/* Price */}
                        <td className="py-4 px-4">
                          <span className="text-sm font-bold text-slate-900">₹{product.price?.toFixed(2)}</span>
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => navigate(`/seller/products/${product._id || product.id}/edit`)}
                              className="flex items-center gap-1.5 text-sm text-slate-600 hover:text-blue-600 border border-slate-200 hover:border-blue-300 px-3 py-1.5 rounded-lg font-medium transition-colors"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                              </svg>
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(product._id || product.id)}
                              className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-700 border border-red-100 hover:border-red-300 hover:bg-red-50 px-3 py-1.5 rounded-lg font-medium transition-colors"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                              </svg>
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
          </div>

          {!productsHook.isLoading && filtered.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-400 text-sm">No products found.</p>
              <Link to="/seller/products/new" className="text-blue-600 text-sm font-medium hover:underline mt-1 inline-block">
                Add your first product
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default SellerDashboardPage
