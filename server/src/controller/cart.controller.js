import cartModel from "../models/cart.model.js";

const populateCart = (cart) => cart.populate("items.product");

export const getCart = async (req, res) => {
  try {
    let cart = await cartModel.findOne({ user: req.user.userId });
    if (!cart) cart = await cartModel.create({ user: req.user.userId, items: [] });
    await populateCart(cart);
    return res.status(200).json({ cart });
  } catch (error) {
    return res.status(500).json({ message: "error fetching cart", error: error.message });
  }
};

export const addToCart = async (req, res) => {
  const { productId, size, quantity = 1 } = req.body;
  try {
    let cart = await cartModel.findOne({ user: req.user.userId });
    if (!cart) cart = new cartModel({ user: req.user.userId, items: [] });

    const existingIndex = cart.items.findIndex(
      (item) => item.product._id?.toString() === productId || item.product.toString() === productId && item.size === size
    );

    if (existingIndex > -1) {
      cart.items[existingIndex].quantity += quantity;
    } else {
      cart.items.push({ product: productId, size, quantity });
    }

    await cart.save();
    await populateCart(cart);
    return res.status(200).json({ cart, message: "added to cart" });
  } catch (error) {
    return res.status(500).json({ message: "error adding to cart", error: error.message });
  }
};

export const updateQuantity = async (req, res) => {
  const { productId, size, quantity } = req.body;
  try {
    const cart = await cartModel.findOne({ user: req.user.userId });
    if (!cart) return res.status(404).json({ message: "cart not found" });

    const existingIndex = cart.items.findIndex(
      (item) => (item.product._id?.toString() === productId || item.product.toString() === productId) && item.size === size
    );

    if (existingIndex > -1) {
      cart.items[existingIndex].quantity = quantity;
      if (quantity <= 0) {
        cart.items.splice(existingIndex, 1);
      }
      await cart.save();
      await populateCart(cart);
      return res.status(200).json({ cart });
    }
    return res.status(404).json({ message: "item not found in cart" });
  } catch (error) {
    return res.status(500).json({ message: "error updating quantity", error: error.message });
  }
};

export const removeFromCart = async (req, res) => {
  const { productId, size } = req.body;
  try {
    const cart = await cartModel.findOne({ user: req.user.userId });
    if (!cart) return res.status(404).json({ message: "cart not found" });

    cart.items = cart.items.filter(
      (item) => !((item.product._id?.toString() === productId || item.product.toString() === productId) && item.size === size)
    );
    await cart.save();
    await populateCart(cart);
    return res.status(200).json({ cart });
  } catch (error) {
    return res.status(500).json({ message: "error removing item", error: error.message });
  }
};

export const clearCart = async (req, res) => {
  try {
    const cart = await cartModel.findOne({ user: req.user.userId });
    if (cart) {
      cart.items = [];
      await cart.save();
    }
    return res.status(200).json({ cart });
  } catch (error) {
    return res.status(500).json({ message: "error clearing cart", error: error.message });
  }
};
