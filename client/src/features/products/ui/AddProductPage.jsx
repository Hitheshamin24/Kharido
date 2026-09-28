import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { SellerNavbar } from '../../../components/Navbar'
import { useProducts } from '../hooks/useProducts'
import { selectProductById } from '../state/productsSlice'
import { logout } from '../../auth/state/authSlice'
import { useApiAuth } from '../../auth/api/authApi'

const AVAILABLE_SIZES = ["XS", "S", "M", "L", "XL", "XXL"]

const AddProductPage = ({ isEditing = false }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { id } = useParams()
  const products = useProducts()
  const {logoutUser}=useApiAuth()

  // Pre-load product from Redux when editing
  const existingProduct = useSelector((state) => selectProductById(id)(state))

  const { register, handleSubmit, setValue, reset, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      title: '',
      description: '',
      price: '',
      sizes: AVAILABLE_SIZES.map(size => ({ size, stock: 0 }))
    }
  })

  // State to hold files or existing image URLs
  const [images, setImages] = useState([])
  const [isDragging, setIsDragging] = useState(false)

  // Pre-fill when editing
  useEffect(() => {
    if (isEditing && existingProduct) {
      const formSizes = AVAILABLE_SIZES.map(size => {
        const existingSize = existingProduct.sizes?.find(s => s.size === size)
        return { size, stock: existingSize ? existingSize.stock : 0 }
      })

      reset({
        title: existingProduct.title || '',
        description: existingProduct.description || '',
        price: existingProduct.price || '',
        sizes: formSizes
      })
      setImages(existingProduct.images || [])
    }
  }, [isEditing, existingProduct, reset])

  const handleImageFile = (files) => {
    const validFiles = Array.from(files).filter(file => file.type.startsWith('image/'))
    if (!validFiles.length) return

    const remainingSlots = 5 - images.length
    if (remainingSlots <= 0) return

    const filesToProcess = validFiles.slice(0, remainingSlots)
    
    setImages(prev => {
      const updated = [...prev, ...filesToProcess]
      setValue('images', updated, { shouldValidate: true }) // to satisfy hook-form validation if any
      return updated
    })
  }

  const removeImage = (index) => {
    setImages(prev => {
      const updated = prev.filter((_, i) => i !== index)
      setValue('images', updated, { shouldValidate: true })
      return updated
    })
  }

  const handleLogout = () => {
    dispatch(logout())
    logoutUser()
    navigate('/login', { replace: true })
  }

  const onSubmit = async (data) => {
    const formData = new FormData()
    formData.append('title', data.title)
    formData.append('description', data.description)
    formData.append('price', data.price)
    
    formData.append('sizes', JSON.stringify(data.sizes))

    // images
    images.forEach(img => {
      if (typeof img === 'string') {
        formData.append('images', img) 
      } else {
        formData.append('images', img)
      }
    })

    try {
      if (isEditing && existingProduct) {
        await products.update({ id: existingProduct._id || existingProduct.id, data: formData })
      } else {
        await products.add(formData)
      }
      navigate('/seller/products')
    } catch (error) {
      console.error(error)
      alert("Failed to save product")
    }
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
              {isEditing ? 'Update your product listing details.' : 'Create a new product listing.'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                  {...register('title', { required: 'Title is required' })}
                  placeholder="e.g. Minimalist Ergonomic Desk Chair"
                  className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                />
                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  {...register('description', {
                    required: 'Description is required',
                    minLength: { value: 20, message: 'Minimum 20 characters' },
                    maxLength: { value: 500, message: 'Maximum 500 characters' }
                  })}
                  placeholder="Provide an accurate and concise description..."
                  rows={5}
                  className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all resize-none"
                />
                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
              </div>
            </div>
          </div>

          {/* Pricing & Inventory */}
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <h2 className="text-base font-bold text-slate-900 mb-1">Pricing & Inventory</h2>
            <p className="text-sm text-slate-500 mb-5">Set the pricing and available stock per size.</p>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                Price (INR) <span className="text-red-500">*</span>
              </label>
              <div className="relative w-full sm:w-1/3">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">₹</span>
                <input
                  type="number"
                  {...register('price', { required: 'Price is required', min: 0 })}
                  placeholder="0.00" step="0.01"
                  className="w-full border border-slate-200 rounded-lg pl-7 pr-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>
              {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-3">
                Sizes & Stock Quantity
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {AVAILABLE_SIZES.map((size, index) => (
                  <div key={size} className="flex items-center gap-3">
                    <span className="w-10 text-sm font-medium text-slate-700">{size}</span>
                    <input
                      type="number"
                      {...register(`sizes.${index}.stock`, { valueAsNumber: true })}
                      min="0"
                      placeholder="0"
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-500 transition-all"
                    />
                    <input type="hidden" {...register(`sizes.${index}.size`)} value={size} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Product Images */}
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <h2 className="text-base font-bold text-slate-900 mb-1">Product Images</h2>
            <p className="text-sm text-slate-500 mb-5">Upload up to 5 high-quality images (JPEG, PNG, WebP).</p>

            <input type="hidden" {...register('images', { validate: v => v?.length <= 5 || 'Maximum 5 images allowed' })} />
            {errors.images && <p className="text-red-500 text-xs mb-3">{errors.images.message}</p>}

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
              {images.map((img, idx) => {
                const src = typeof img === 'string' ? img : URL.createObjectURL(img)
                return (
                  <div key={idx} className="relative group rounded-xl overflow-hidden border border-slate-200 aspect-square">
                    <img src={src} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )
              })}
              
              {images.length < 5 && (
                <label
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleImageFile(e.dataTransfer.files) }}
                  className={`border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer aspect-square transition-colors ${
                    isDragging ? 'border-blue-400 bg-blue-50' : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-slate-400">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                  </div>
                  <span className="text-xs font-medium text-slate-500">Add Image</span>
                  <input type="file" multiple accept="image/*" onChange={(e) => handleImageFile(e.target.files)} className="sr-only" />
                </label>
              )}
            </div>
            <p className="text-xs text-slate-400">{images.length} / 5 uploaded</p>
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
