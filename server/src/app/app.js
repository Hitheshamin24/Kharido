import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRouter from "../routes/user.routes.js";
import productRouter from "../routes/product.routes.js";
import cartRouter from "../routes/cart.routes.js";
const app = express();

app.use(cors({
  origin: process.env.VITE_FRONTEND_URL || "http://localhost:5173",
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/products", productRouter);
app.use("/api/cart", cartRouter);
export default app;
