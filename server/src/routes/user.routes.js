import { Router } from "express";
import {
  getCurrentUser,
  loginController,
  refreshController,
  registerController,
} from "../controller/user.controller.js";
import {
  loginValidator,
  registerValidator,
} from "../validator/user.validator.js";
import { authenticate } from "../middleware/user.middleware.js";

const router = Router();

router.post("/register", registerValidator, registerController);
router.post("/login", loginValidator, loginController);
router.get("/me", authenticate, getCurrentUser);
router.post("/refresh", refreshController);
export default router;
