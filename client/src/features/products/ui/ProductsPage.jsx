import { useState } from 'react'
import { useSelector } from 'react-redux'
import { PublicNavbar } from '../../../components/Navbar'
import { selectPublishedProducts } from '../state/productsSlice'

// Dummy categories
const CATEGORIES = ['All', 'Electronics', 'Furniture', 'Accessories']

// Sub-components
const StarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-amber-400">
    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
  </svg>
)

const ProductCard = ({ product }) => (
  <div className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group">
    <div className="aspect-square overflow-hidden bg-slate-50">
      <img
        src={product.image}
        alt={product.title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        onError={(e) => {
          e.target.src = `https://placehold.co/400x400/e2e8f0/94a3b8?text=${encodeURIComponent(product.category)}`
        }}
      />
    </div>
    <div className="p-4">
      <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
        {product.category}
      </span>
      <h3 className="font-semibold text-slate-800 text-sm mt-2 line-clamp-2 leading-snug">
        {product.title}
      </h3>
      {product.rating > 0 && (
        <div className="flex items-center gap-1 mt-1.5">
          <StarIcon />
          <span className="text-xs text-slate-600 font-medium">{product.rating}</span>
          <span className="text-xs text-slate-400">({product.reviews})</span>
        </div>
      )}
      <div className="flex items-center justify-between mt-3">
        <span className="text-lg font-bold text-slate-900">${product.price.toFixed(2)}</span>
        <button className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg font-medium transition-colors">
          Add to Cart
        </button>
      </div>
      <p className="text-xs text-slate-400 mt-1">by {product.seller}</p>
    </div>
  </div>
)

// Products page
const ProductsPage = () => {
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  // Only show Published products (from Redux)
  const allPublished = useSelector(selectPublishedProducts)

  const filtered = allPublished.filter((p) => {
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="min-h-screen bg-slate-50">
      <PublicNavbar />

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-1">Shop on Kharido</h1>
          <p className="text-slate-500 text-sm">
            Discover {allPublished.length} products from independent sellers
          </p>
        </div>

        {/* Filters + Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeCategory === cat
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="flex-1 sm:max-w-xs ml-auto">
            <div className="relative">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-200 rounded-lg bg-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-slate-400 text-sm">No products found matching your search.</p>
          </div>
        )}
      </main>
    </div>
  )
}

export default ProductsPage
