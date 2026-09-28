import { useDispatch, useSelector } from 'react-redux';
import { useApiCart } from '../api/cartApi';
import {
  setCartItems,
  addToCart as addToCartState,
  removeFromCart as removeFromCartState,
  updateQuantity as updateQuantityState,
  clearCart as clearCartState,
  openCart,
  closeCart,
  toggleCart
} from '../state/cartSlice';

export const useCart = () => {
  const dispatch = useDispatch();
  const cartApi = useApiCart();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  // Helper to map backend cart format to frontend redux format
  const mapBackendCart = (cart) => {
    if (!cart || !cart.items) return [];
    return cart.items.map(item => ({
      itemId: `${item.product._id}-${item.size || 'nosize'}`,
      productId: item.product._id,
      title: item.product.title,
      price: item.product.price,
      image: item.product.images && item.product.images.length > 0 ? item.product.images[0] : '',
      seller: item.product.seller,
      size: item.size,
      quantity: item.quantity
    }));
  };

  const loadCart = async () => {
    try {
      const res = await cartApi.getCart();
      const items = mapBackendCart(res.data.cart);
      dispatch(setCartItems(items));
    } catch (err) {
      console.error('Failed to load cart from DB', err);
    }
  };

  const add = async ({ product, size, quantity = 1 }) => {
    // Optimistic update
    dispatch(addToCartState({ product, size, quantity }));
    if (isAuthenticated) {
      try {
        await cartApi.addToCart(product._id || product.id, size, quantity);
      } catch (err) {
        console.error('Failed to add to DB cart', err);
      }
    }
  };

  const remove = async (itemId, productId, size) => {
    dispatch(removeFromCartState(itemId));
    if (isAuthenticated) {
      try {
        await cartApi.removeFromCart(productId, size);
      } catch (err) {
        console.error('Failed to remove from DB cart', err);
      }
    }
  };

  const update = async (itemId, productId, size, quantity) => {
    dispatch(updateQuantityState({ itemId, amount: quantity }));
    if (isAuthenticated) {
      try {
        await cartApi.updateCartQuantity(productId, size, quantity);
      } catch (err) {
        console.error('Failed to update DB cart', err);
      }
    }
  };

  const clear = async () => {
    dispatch(clearCartState());
    if (isAuthenticated) {
      try {
        await cartApi.clearCart();
      } catch (err) {
        console.error('Failed to clear DB cart', err);
      }
    }
  };

  return {
    loadCart,
    add,
    remove,
    update,
    clear,
    open: () => dispatch(openCart()),
    close: () => dispatch(closeCart()),
    toggle: () => dispatch(toggleCart()),
  };
};
