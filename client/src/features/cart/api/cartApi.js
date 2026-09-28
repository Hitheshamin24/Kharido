import { useApi } from "../../../shared/api/useApi";

export const useApiCart = () => {
  const api = useApi();

  const getCart = async () => {
    return await api.get("/cart");
  };

  const addToCart = async (productId, size, quantity) => {
    return await api.post("/cart", { productId, size, quantity });
  };

  const removeFromCart = async (productId, size) => {
    return await api.post("/cart/remove", { productId, size });
  };

  const updateCartQuantity = async (productId, size, quantity) => {
    return await api.put("/cart", { productId, size, quantity });
  };

  const clearCart = async () => {
    return await api.delete("/cart");
  };

  return {
    getCart,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
  };
};
