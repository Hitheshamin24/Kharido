import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { SellerNavbar } from '../../../components/Navbar'
import { addProduct, updateProduct, selectProductById } from '../state/productsSlice'
import { logout } from '../../auth/state/authSlice'

// ─── Dummy categories ─────────────────────────────────────────────────────────
const CATEGORIES = [
  'Electronics', 'Furniture', 'Accessories',
  'Clothing', 'Sports', 'Books', 'Food & Beverages', 'Other',
]

// ─── Page ─────────────────────────────────────────────────────────────────────
const AddProductPage = ({ isEditing = false }) => {
  const dispatch  = useDispatch()
  const navigate  = useNavigate()
  const { id }    = useParams()

  // Pre-load product from Redux when editing
  const existingProduct = useSelector(selectProductById(Number(id)))

  const [formData, setFormData] = useState({
    title: '', description: '', category: '',
    price: '', stock: '', sku: '', isPublished: true, image: '',
  })
  const [imagePreview, setImagePreview] = useState(null)
  const [isDragging,   setIsDragging]   = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Pre-fill when editing
  useEffect(() => {
    if (isEditing && existingProduct) {
      setFormData({
        title:       existingProduct.title,
        description: existingProduct.description,
        category:    existingProduct.category,
        price:       String(existingProduct.price),
        stock:       String(existingProduct.stock),
        sku:         existingProduct.sku,
        isPublished: existingProduct.status === 'Published',
        image:       existingProduct.image,
      })
      setImagePreview(existingProduct.image)
    }
  }, [isEditing, existingProduct])

  const handleChange    = (field, value) => setFormData((p) => ({ ...p, [field]: value }))

  const handleImageFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
        handleChange('image', reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login', { replace: true })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    await new Promise((r) => setTimeout(r, 500))

    const payload = {
      title:       formData.title,
      description: formData.description,
      category:    formData.category,
      price:       parseFloat(formData.price),
      stock:       parseInt(formData.stock, 10),
      sku:         formData.sku || `KHR-${Date.now().toString().slice(-4)}`,
      status:      formData.isPublished ? 'Published' : 'Unpublished',
      image:       formData.image ||
        `https://placehold.co/400x400/e2e8f0/94a3b8?text=${encodeURIComponent(formData.category || 'Product')}`,
    }

    if (isEditing && existingProduct) {
      dispatch(updateProduct({ ...existingProduct, ...payload }))
    } else {
      dispatch(addProduct(payload))
    }

    setIsSubmitting(false)
    navigate('/seller/products')
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <SellerNavbar onLogout={handleLogout} />

      <main className="max-w-3xl mx-auto px-6 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
          <Link to="/seller/products" className="hover:text-blue-600 transition-colors">
            Seller Products
          </Link>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
          </svg>
          <span className="text-slate-800 font-medium">{isEditing ? 'Edit Product' : 'Add Product'}</span>
        </nav>

        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              {isEditing ? 'Edit Product' : 'Add New Product'}
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              {isEditing
                ? 'Update your product listing details.'
                : <>Create a new product listing. Images via <code className="bg-slate-100 text-blue-700 px-1.5 py-0.5 rounded text-xs font-mono">multipart/form-data</code>.</>
              }
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-sm shrink-0">
            <div className="w-2 h-2 rounded-full bg-blue-600" />
            <span className="text-slate-600 font-medium">Merchant ID:</span>
            <span className="font-bold text-slate-900">KHR-7801</span>
          </div>
        </div>

        {/* API Banner */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-blue-600 shrink-0">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
            <span className="text-sm text-slate-700">
              Dispatched via{' '}
              <code className="bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded text-xs font-mono font-semibold">
                {isEditing ? `PUT /api/products/${id}` : 'POST /api/products'}
              </code>
              {' '}→ Redux store
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
            </svg>
            Encrypted Stream
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* General Information */}
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <h2 className="text-base font-bold text-slate-900 mb-1">General Information</h2>
            <p className="text-sm text-slate-500 mb-5">Basic customer-facing identification and copy for the catalog.</p>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                  Product Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="e.g. Minimalist Ergonomic Desk Chair"
                  required
                  className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                />
                <p className="text-xs text-slate-400 mt-1.5">A descriptive name increases search relevance inside the marketplace.</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                  Description <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    placeholder="Provide an accurate and concise description including dimensions, materials, and warranty information..."
                    maxLength={2000}
                    rows={5}
                    required
                    className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all resize-none"
                  />
                  <span className="absolute bottom-2 right-2 text-xs text-slate-400">
                    {formData.description.length} / 2000
                  </span>
                </div>
                <p className="text-xs text-blue-600 mt-1.5 font-medium">Standard Markdown format supported.</p>
              </div>
            </div>
          </div>

          {/* Pricing & Inventory */}
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <h2 className="text-base font-bold text-slate-900 mb-1">Pricing & Inventory</h2>
            <p className="text-sm text-slate-500 mb-5">Set the pricing, SKU, and available stock quantity.</p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                  Price (USD) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">$</span>
                  <input
                    type="number" value={formData.price}
                    onChange={(e) => handleChange('price', e.target.value)}
                    placeholder="0.00" min="0" step="0.01" required
                    className="w-full border border-slate-200 rounded-lg pl-7 pr-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                  Stock Quantity <span className="text-red-500">*</span>
                </label>
                <input
                  type="number" value={formData.stock}
                  onChange={(e) => handleChange('stock', e.target.value)}
                  placeholder="e.g. 50" min="0" required
                  className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-1.5">SKU</label>
                <input
                  type="text" value={formData.sku}
                  onChange={(e) => handleChange('sku', e.target.value)}
                  placeholder="e.g. KHR-0001"
                  className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Category & Visibility */}
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <h2 className="text-base font-bold text-slate-900 mb-1">Category & Visibility</h2>
            <p className="text-sm text-slate-500 mb-5">Categorize your product and set its live status on the storefront.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                  required
                  className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all bg-white"
                >
                  <option value="">Select a category</option>
                  {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-1.5">Live Status</label>
                <div className="flex rounded-lg border border-slate-200 overflow-hidden">
                  {[
                    { label: 'Published', value: true,  color: 'green' },
                    { label: 'Draft',     value: false, color: 'slate' },
                  ].map(({ label, value, color }) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => handleChange('isPublished', value)}
                      className={`flex-1 py-2.5 text-sm font-medium transition-colors flex items-center justify-center gap-1.5 border-r last:border-r-0 border-slate-200 ${
                        formData.isPublished === value
                          ? color === 'green'
                            ? 'bg-green-50 text-green-700'
                            : 'bg-slate-100 text-slate-700'
                          : 'bg-slate-50 text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        formData.isPublished === value
                          ? color === 'green' ? 'bg-green-500' : 'bg-slate-500'
                          : 'bg-slate-300'
                      }`} />
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Product Image */}
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <h2 className="text-base font-bold text-slate-900 mb-1">Product Image</h2>
            <p className="text-sm text-slate-500 mb-5">Upload a high-quality image (JPEG, PNG, WebP — max 5MB).</p>

            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleImageFile(e.dataTransfer.files[0]) }}
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                isDragging ? 'border-blue-400 bg-blue-50' : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
              }`}
            >
              {imagePreview ? (
                <div className="flex flex-col items-center gap-3">
                  <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover rounded-xl border border-slate-200" onError={(e) => { e.target.style.display = 'none' }} />
                  <button type="button" onClick={() => { setImagePreview(null); handleChange('image', '') }} className="text-sm text-red-500 hover:text-red-700 font-medium">
                    Remove image
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer flex flex-col items-center gap-3">
                  <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-slate-400">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-700">Drag & drop or click to upload</p>
                    <p className="text-xs text-slate-400 mt-0.5">JPEG, PNG, WebP — max 5MB</p>
                  </div>
                  <input type="file" accept="image/*" onChange={(e) => handleImageFile(e.target.files[0])} className="sr-only" />
                </label>
              )}
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-3 pb-4">
            <Link to="/seller/products" className="px-5 py-2.5 text-sm font-medium text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-70 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  {isEditing ? 'Saving...' : 'Creating...'}
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  {isEditing ? 'Save Changes' : 'Create Listing'}
                </>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}

export default AddProductPage
