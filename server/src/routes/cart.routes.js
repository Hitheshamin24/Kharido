import express from "express";
import { authenticate } from "../middleware/user.middleware.js";
import { getCart, addToCart, updateQuantity, removeFromCart, clearCart } from "../controller/cart.controller.js";

const router = express.Router();

router.use(authenticate); // all cart routes require login

router.get("/", getCart);
router.post("/", addToCart);
router.put("/", updateQuantity);
router.post("/remove", removeFromCart);
router.delete("/", clearCart);

export default router;
