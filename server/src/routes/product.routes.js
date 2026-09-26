import { Router } from "express";
import {
  productValidator,
  updateProductValidator,
} from "../validator/product.validator.js";
import {
  addProductsController,
  deleteProductController,
  getAllProduct,
  getSingleProduct,
  updateProductController,
} from "../controller/product.controller.js";
import { authenticate } from "../middleware/user.middleware.js";
import { authenticateSeller } from "../middleware/seller.middleware.js";
import multer from "multer";
import { parseSize } from "../middleware/uploadAndParse.middleware.js";

const router = Router();
export const uploadImage = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 1 * 1024 * 1024,
    files: 5,
  },
});

router.post(
  "/",
  authenticate,
  authenticateSeller,
  uploadImage.array("images"),
  parseSize,
  productValidator,
  addProductsController,
);
router.get("/", getAllProduct);
router.put(
  "/:id",
  authenticate,
  authenticateSeller,
  uploadImage.array("images"),
  parseSize,
  updateProductValidator,
  updateProductController,
);
router.get("/:id", getSingleProduct);
router.delete(
  "/:id",
  authenticate,
  authenticateSeller,
  deleteProductController,
);
export default router;
