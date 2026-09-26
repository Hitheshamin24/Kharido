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
import { parseSize, uploadImage } from "../middleware/uploadAndParse.middleware.js";

const router = Router();

router.post(
  "/",
  authenticate,
  authenticateSeller,
  uploadImage.array("images", 5),
  parseSize,
  productValidator,
  addProductsController
);

router.get("/", getAllProduct);
router.get("/:id", getSingleProduct);

router.put(
  "/:id",
  authenticate,
  authenticateSeller,
  uploadImage.array("images", 5),
  parseSize,
  updateProductValidator,
  updateProductController
);

router.delete(
  "/:id",
  authenticate,
  authenticateSeller,
  deleteProductController
);

export default router;
