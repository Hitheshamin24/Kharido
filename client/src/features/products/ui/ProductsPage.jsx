import { useState, useEffect } from "react";
import { Link } from "react-router";
import {  useSelector } from "react-redux";
import { PublicNavbar } from "../../../components/Navbar";
import { useProducts } from "../hooks/useProducts";
import { selectCartItems } from "../../cart/state/cartSlice";
import { selectIsAuthenticated } from "../../auth/state/authSlice";
import { useCart } from "../../cart/hooks/useCart";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

// Sub-components
const StarIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-3.5 h-3.5 text-amber-400"
  >
    <path
      fillRule="evenodd"
      d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
      clipRule="evenodd"
    />
  </svg>
);

const ProductCard = ({ product }) => {
  const cartItems = useSelector(selectCartItems);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const navigate = useNavigate();
  const cart = useCart();
  const isInCart = cartItems.some(item => item.productId === (product._id || product.id));

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group flex flex-col">
      <div className="aspect-square flex overflow-x-auto snap-x snap-mandatory bg-slate-50 scrollbar-hide relative group/image">
        {product.images && product.images.length > 0 ? (
          product.images.map((img, idx) => (
            <Link key={idx} to={`/products/${product._id || product.id}`} className="w-full h-full shrink-0 snap-center block">
              <img
                src={img}
                alt={`${product.title} - ${idx + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = `https://placehold.co/400x400/e2e8f0/94a3b8?text=${encodeURIComponent(product.title || "Product")}`;
                }}
              />
            </Link>
          ))
        ) : (
          <Link to={`/products/${product._id || product.id}`} className="w-full h-full block">
            <img
              src={`https://placehold.co/400x400/e2e8f0/94a3b8?text=${encodeURIComponent(product.title || "Product")}`}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          </Link>
        )}
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <Link to={`/products/${product._id || product.id}`} className="block mb-auto">
          <h3 className="font-semibold text-slate-800 text-sm mt-2 line-clamp-2 leading-snug hover:text-blue-600 transition-colors">
            {product.title}
          </h3>
        </Link>
        {product.rating > 0 && (
          <div className="flex items-center gap-1 mt-1.5">
            <StarIcon />
            <span className="text-xs text-slate-600 font-medium">
              {product.rating}
            </span>
            <span className="text-xs text-slate-400">({product.reviews})</span>
          </div>
        )}
        <div className="flex items-center justify-between mt-3">
          <span className="text-lg font-bold text-slate-900">
            ₹{product.price?.toFixed(2)}
          </span>
          <button 
            onClick={(e) => {
              if (isInCart) {
                e.preventDefault();
                cart.open();
              } else {
                if (!isAuthenticated) {
                  e.preventDefault();
                  toast.error("Please login to add items to your cart");
                  navigate("/login");
                  return;
                }
                
                if (product.sizes && product.sizes.length > 0) {
                  // If product has sizes, navigate to details page instead of adding arbitrary size
                  e.preventDefault();
                  navigate(`/products/${product._id || product.id}`);
                } else {
                  cart.add({ product, size: null });
                  cart.open();
                }
              }
            }}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors z-10 relative ${
              isInCart
                ? 'bg-green-600 text-white hover:bg-green-700 cursor-pointer'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isInCart ? (
              <span className="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
                Added to Cart
              </span>
            ) : (
              (product.sizes && product.sizes.length > 0) ? "Select Size" : "Add to Cart"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// Products page
const ProductsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const products = useProducts();

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    products.fetchAll({ search: debouncedSearch, page: 1, limit: 20 });
  }, [debouncedSearch]);

  const allProducts = products.all || [];

  return (
    <div className="min-h-screen bg-slate-50">
      <PublicNavbar />

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-1">
            Shop on Kharido
          </h1>
          <p className="text-slate-500 text-sm">
            Discover {allProducts.length} products
          </p>
        </div>

        {/* Filters + Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 sm:max-w-xs ml-auto">
            <div className="relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
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
        {products.isLoading ? (
          <div className="flex justify-center py-16">
            <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : allProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {allProducts.map((product) => (
              <ProductCard key={product._id || product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-slate-400 text-sm">
              No products found matching your search.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProductsPage;
